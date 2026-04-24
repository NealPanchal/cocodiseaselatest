import { useEffect, useRef, useState } from 'react'
import { X, RefreshCw, Camera, AlertTriangle, ShieldCheck, Search, Loader2 } from 'lucide-react'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'

// Constants for performance and accuracy
const BUFFER_SIZE = 8
const STABILITY_THRESHOLD = 3
const PREDICTION_INTERVAL = 500 // ms
const BRIGHTNESS_THRESHOLD = 40
const BLUR_THRESHOLD = 15 // Laplacian variance threshold

export default function LiveCamera({ onClose, onCapture, mode = 'live' }) {
  const { lang } = useLanguage()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const lastPredictionTime = useRef(0)
  
  const [stream, setStream] = useState(null)
  const [lastBlob, setLastBlob] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [isScanning, setIsScanning] = useState(true)
  const [isCapturing, setIsCapturing] = useState(false)
  
  // New states for stability and quality
  const [predictionBuffer, setPredictionBuffer] = useState([]) // Stores { disease, confidence, report }
  const [stabilityLock, setStabilityLock] = useState(null) // { disease, expiresAt, report, confidence }
  const [qualityStatus, setQualityStatus] = useState('ok') // 'ok' | 'blurry' | 'dark'

  // Start camera on mount
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [facingMode])

  // Prediction loop (ONLY for live mode)
  useEffect(() => {
    let intervalId
    if (mode === 'live' && isScanning && stream) {
      intervalId = setInterval(captureAndPredict, PREDICTION_INTERVAL)
    }
    return () => clearInterval(intervalId)
  }, [isScanning, stream, mode])

  async function startCamera() {
    stopCamera()
    try {
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
      const newStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        videoRef.current.play()
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert(t(lang, 'camera_error') || "Could not access camera.")
      onClose()
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  function switchCamera() {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    setPredictionBuffer([])
    setStabilityLock(null)
  }

  // --- IMAGE QUALITY HELPERS ---
  
  function checkImageQuality(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // 1. Brightness check
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
    const avgBrightness = brightness / (data.length / 4);
    
    if (avgBrightness < BRIGHTNESS_THRESHOLD) return 'dark';

    // 2. Simple Blur Check (Laplacian variance approximation)
    let laplacianSum = 0;
    let laplacianSqSum = 0;
    const stride = 4; // Skip pixels for performance
    const rowOffset = width * 4;
    
    for (let y = 1; y < height - 1; y += stride) {
      for (let x = 1; x < width - 1; x += stride) {
        const idx = (y * width + x) * 4;
        const center = data[idx];
        const val = -4 * center + data[idx - stride] + data[idx + stride] + data[idx - rowOffset] + data[idx + rowOffset];
        laplacianSum += val;
        laplacianSqSum += val * val;
      }
    }
    
    const count = (Math.floor((height - 2) / stride) * Math.floor((width - 2) / stride));
    const variance = (laplacianSqSum / count) - ((laplacianSum / count) * (laplacianSum / count));
    
    if (variance < BLUR_THRESHOLD) return 'blurry';
    
    return 'ok';
  }

  // --- SMOOTHING LOGIC ---

  const getProcessedPrediction = (buffer) => {
    if (buffer.length === 0) return null;
    
    // Weighted Voting: Recency and Confidence
    const weights = {};
    let totalConfidence = 0;
    
    buffer.forEach((pred, index) => {
      const recencyWeight = (index + 1) / buffer.length;
      const confidenceWeight = pred.confidence;
      const weight = recencyWeight * confidenceWeight;
      
      weights[pred.disease] = (weights[pred.disease] || 0) + weight;
      totalConfidence += pred.confidence;
    });

    let winner = null;
    let maxWeight = -1;
    Object.entries(weights).forEach(([disease, weight]) => {
      if (weight > maxWeight) {
        maxWeight = weight;
        winner = disease;
      }
    });

    // Confirmation check: winner must be in at least 3 of last 5 frames
    const recentFrames = buffer.slice(-5);
    const occurrenceCount = recentFrames.filter(p => p.disease === winner).length;
    
    if (occurrenceCount < 3) return null;

    const winnerData = buffer.filter(p => p.disease === winner).slice(-1)[0];

    return {
      disease: winner,
      confidence: totalConfidence / buffer.length,
      report: winnerData.report,
      isConfirmed: true
    };
  };

  async function performCaptureAndPredict() {
    if (!videoRef.current || !canvasRef.current) return
    
    // Stability Lock Check
    if (stabilityLock && Date.now() < stabilityLock.expiresAt) {
      return; 
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video.videoWidth === 0 || video.videoHeight === 0) return

    // ROI Focus: Center Cropping (Square 448x448 relative to view)
    const size = Math.min(video.videoWidth, video.videoHeight) * 0.8;
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;
    
    canvas.width = 448;
    canvas.height = 448;

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(video, startX, startY, size, size, 0, 0, 448, 448);

    // Frame Quality Check
    const quality = checkImageQuality(ctx, 448, 448);
    setQualityStatus(quality);
    if (quality !== 'ok') {
      // Degrade buffer slightly even on bad frames to stay fresh
      if (predictionBuffer.length > 0) setPredictionBuffer(prev => prev.slice(1));
      return;
    }

    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(null)
          return
        }
        setLastBlob(blob)
        setIsCapturing(true)

        const formData = new FormData()
        formData.append('file', blob, 'capture.jpg')
        formData.append('lang', lang)

        try {
          const res = await fetch('/predict', {
            method: 'POST',
            body: formData
          })
          if (res.ok) {
            const data = await res.json()
            
            setPredictionBuffer(prev => {
              const newBuffer = [...prev, { disease: data.disease, confidence: data.confidence, report: data.report }].slice(-BUFFER_SIZE);
              
              // Check for stability lock
              const recent = newBuffer.slice(-STABILITY_THRESHOLD);
              if (recent.length === STABILITY_THRESHOLD && recent.every(p => p.disease === data.disease)) {
                setStabilityLock({
                  disease: data.disease,
                  report: data.report,
                  confidence: (recent.reduce((a, b) => a + b.confidence, 0) / STABILITY_THRESHOLD),
                  expiresAt: Date.now() + 2000
                });
              }
              
              return newBuffer;
            });
            
            resolve(data)
          } else {
            resolve(null)
          }
        } catch (err) {
          console.error("Prediction failed:", err)
          resolve(null)
        } finally {
          setIsCapturing(false)
        }
      }, 'image/jpeg', 0.8)
    })
  }

  async function captureAndPredict() {
    if (!isScanning) return
    const now = Date.now();
    if (now - lastPredictionTime.current < PREDICTION_INTERVAL) return;
    lastPredictionTime.current = now;
    await performCaptureAndPredict()
  }

  async function handleManualCapture() {
    const finalResult = stabilityLock || getProcessedPrediction(predictionBuffer);
    if (finalResult && lastBlob) {
      onCapture(finalResult, lastBlob)
    } else {
      const result = await performCaptureAndPredict()
      if (result) onCapture(result, lastBlob)
    }
  }

  // Derived Values for UI
  const displayPrediction = stabilityLock || getProcessedPrediction(predictionBuffer);
  const isStable = !!stabilityLock || (displayPrediction?.isConfirmed);
  const isAnalyzing = !displayPrediction && predictionBuffer.length > 0;
  
  return (
    <div className="cameraModalOverlay">
      <div className="cameraModal" style={{ maxWidth: '100%', height: '100%', borderRadius: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="cameraHeader" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', color: 'white', padding: '20px 15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px' }}>
                <Search size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
                {mode === 'live' ? "SMART LIVE SCAN" : t(lang, 'take_photo')}
              </h3>
            </div>
            <button onClick={onClose} style={{ color: 'white', background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Video Feed */}
        <div className="cameraVideoWrapper" style={{ flex: 1, position: 'relative', background: 'black', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* ROI Focus Overlay */}
          {mode === 'live' && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '280px',
              height: '280px',
              border: `2px dashed ${qualityStatus === 'ok' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(239, 68, 68, 0.8)'}`,
              borderRadius: '24px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
              pointerEvents: 'none',
              zIndex: 5,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981', borderTopLeftRadius: 20 }} />
              <div style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTop: '4px solid #10b981', borderRight: '4px solid #10b981', borderTopRightRadius: 20 }} />
              <div style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981', borderBottomLeftRadius: 20 }} />
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981', borderBottomRightRadius: 20 }} />
            </div>
          )}

          {/* Quality Indicator */}
          {qualityStatus !== 'ok' && (
            <div style={{
              position: 'absolute',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(239, 68, 68, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 40,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <AlertTriangle size={18} />
              {qualityStatus === 'dark' ? "Too Dark" : "Too Blurry"}
            </div>
          )}

          {/* Stability Status */}
          {isStable && (
            <div style={{
              position: 'absolute',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(16, 185, 129, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 40,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <ShieldCheck size={18} />
              STABLE DETECTION
            </div>
          )}

          {isAnalyzing && !isStable && (
            <div style={{
              position: 'absolute',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(59, 130, 246, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Loader2 size={18} className="animate-spin" />
              ANALYZING...
            </div>
          )}

          {/* Prediction Result Overlay */}
          {mode === 'live' && displayPrediction && (
            <div style={{
              position: 'absolute',
              bottom: '130px',
              left: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              zIndex: 50,
              border: `2px solid ${displayPrediction.disease === 'Healthy_Leaves' ? '#10b981' : '#ef4444'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: displayPrediction.disease === 'Healthy_Leaves' ? '#065f46' : '#991b1b' }}>
                  {displayPrediction.report?.status || displayPrediction.disease}
                </h4>
                <div style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                  {(displayPrediction.confidence * 100).toFixed(0)}% Match
                </div>
              </div>
              
              <p style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#4b5563', lineHeight: 1.4 }}>
                {displayPrediction.report?.cause?.[0] || "Identifying leaf patterns..."}
              </p>

              <div style={{ height: '8px', width: '100%', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${displayPrediction.confidence * 100}%`,
                  background: displayPrediction.disease === 'Healthy_Leaves' ? '#10b981' : '#ef4444',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Improved Controls */}
        <div className="cameraActions" style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '50px',
          zIndex: 60
        }}>
          <button onClick={switchCamera} style={{
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.4)',
            color: 'white',
            cursor: 'pointer'
          }}>
            <RefreshCw size={26} />
          </button>

          <button
            onClick={mode === 'live' ? () => {
              if (displayPrediction && lastBlob) {
                onCapture(displayPrediction, lastBlob)
              }
            } : handleManualCapture}
            disabled={mode === 'live' ? !displayPrediction : isCapturing}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'white',
              border: `6px solid ${isStable ? '#10b981' : 'rgba(255,255,255,0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isCapturing ? 'scale(0.9)' : 'scale(1)',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '2px solid #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isCapturing ? (
                <div className="spinner" style={{ width: 28, height: 28, border: '4px solid #eee', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Camera size={32} color="black" />
              )}
            </div>
          </button>

          <div style={{ width: '56px' }}></div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
