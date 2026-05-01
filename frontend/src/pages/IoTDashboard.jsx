import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Radio, MapPin, TreePine, Activity, Wifi, WifiOff,
  Trash2, Upload, Crosshair, Cpu, Radar,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
  Zap, Navigation, Plane, Clock, History, Signal,
  Circle
} from 'lucide-react'
import '../iot-dashboard.css'

const statusColor = (d) => d === 'Healthy_Leaves' ? 'var(--iot-green)' : 'var(--iot-red)'
const statusLabel = (d) => d === 'Healthy_Leaves' ? 'Healthy' : 'Diseased'
const confPercent = (c) => `${(c * 100).toFixed(1)}%`
const timeAgo = (iso) => {
  if (!iso) return '—'
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return `${Math.floor(s)}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
const fmtTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

const MOCK_UIDS = [
  'RFID-A1B2C3D4','RFID-E5F6G7H8','RFID-I9J0K1L2',
  'RFID-M3N4O5P6','RFID-Q7R8S9T0','RFID-U1V2W3X4',
  'RFID-Y5Z6A7B8','RFID-C9D0E1F2','RFID-G3H4I5J6',
]
const GRID_ROWS = 4, GRID_COLS = 6

export default function IoTDashboard() {
  const [trees, setTrees] = useState([])
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [droneActive, setDroneActive] = useState(false)
  const [dronePos, setDronePos] = useState({ row: 0, col: 0 })
  const [gpsLocation, setGpsLocation] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [expandedTree, setExpandedTree] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [scanLog, setScanLog] = useState([])
  const [autoUid, setAutoUid] = useState('')
  const [wsStatus, setWsStatus] = useState('disconnected')
  const [wsClients, setWsClients] = useState(0)
  const [livePulse, setLivePulse] = useState(false)
  const fileInputRef = useRef(null)
  const droneIntervalRef = useRef(null)
  const wsRef = useRef(null)
  const reconnectTimer = useRef(null)
  const pingTimer = useRef(null)

  const addLog = useCallback((msg) => {
    setScanLog((p) => [{ time: new Date().toLocaleTimeString(), msg }, ...p.slice(0, 29)])
  }, [])

  // ── WebSocket ──
  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const host = window.location.host
    const ws = new WebSocket(`${proto}://${host}/iot/ws`)

    ws.onopen = () => {
      setWsStatus('connected')
      addLog('🔌 WebSocket connected')
      pingTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send('ping')
      }, 25000)
    }

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data)
        if (msg.type === 'pong') return

        if (msg.trees) setTrees(msg.trees)
        if (msg.stats) setStats(msg.stats)
        if (msg.history) setHistory(msg.history)
        if (msg.clients !== undefined) setWsClients(msg.clients)

        if (msg.type === 'scan_result') {
          setLivePulse(true)
          setTimeout(() => setLivePulse(false), 1500)
          const d = msg.data
          addLog(`📡 Live: ${d.tree_id} → ${d.disease} (${confPercent(d.confidence)})`)
        }
        if (msg.type === 'reset') {
          addLog('🗑️ Data reset by remote')
        }
        if (msg.type === 'init') {
          addLog(`📊 Loaded ${msg.trees?.length || 0} trees`)
        }
      } catch {}
    }

    ws.onclose = () => {
      setWsStatus('disconnected')
      clearInterval(pingTimer.current)
      reconnectTimer.current = setTimeout(connectWS, 3000)
    }

    ws.onerror = () => {
      setWsStatus('error')
      ws.close()
    }

    wsRef.current = ws
  }, [addLog])

  useEffect(() => {
    connectWS()
    return () => {
      clearInterval(pingTimer.current)
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connectWS])

  // ── Fallback HTTP fetch (if WS not connected) ──
  const fetchData = useCallback(async () => {
    try {
      const [t, s, h] = await Promise.all([
        fetch('/iot/trees').then(r => r.json()),
        fetch('/iot/stats').then(r => r.json()),
        fetch('/iot/history').then(r => r.json()),
      ])
      setTrees(t.trees || [])
      setStats(s)
      setHistory(h.history || [])
    } catch {}
  }, [])

  // ── GPS ──
  const getGPS = () => {
    if (!navigator.geolocation) return
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (p) => { setGpsLocation({ lat: p.coords.latitude, lng: p.coords.longitude }); setGpsLoading(false); addLog('📍 GPS acquired') },
      () => { setGpsLocation({ lat: 10.0261 + (Math.random()-0.5)*0.01, lng: 76.3125 + (Math.random()-0.5)*0.01 }); setGpsLoading(false); addLog('📍 GPS simulated') }
    )
  }

  // ── RFID ──
  const generateUID = async () => {
    const uid = MOCK_UIDS[Math.floor(Math.random() * MOCK_UIDS.length)]
    setAutoUid(uid)
    addLog(`🏷️ RFID: ${uid}`)
    return uid
  }

  // ── Scan ──
  const handleScan = async () => {
    if (!selectedFile) { addLog('⚠️ No image selected'); return }
    setScanning(true); setScanResult(null)
    addLog('🔄 Scanning...')
    const uid = autoUid || await generateUID()
    if (!gpsLocation) getGPS()
    const fd = new FormData()
    fd.append('file', selectedFile); fd.append('uid', uid); fd.append('lang', 'en')
    if (gpsLocation) { fd.append('lat', String(gpsLocation.lat)); fd.append('lng', String(gpsLocation.lng)) }
    try {
      const res = await fetch('/iot/scan', { method: 'POST', body: fd })
      if (res.status === 429) { const d = await res.json(); addLog(`⏱️ ${d.error}`); setScanning(false); return }
      const data = await res.json()
      setScanResult(data)
      addLog(`✅ ${data.tree_id}: ${data.disease} (${confPercent(data.confidence)})`)
    } catch (e) { addLog(`❌ ${e.message}`) }
    setScanning(false)
  }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) { setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f)); addLog(`📷 ${f.name}`) }
  }

  // ── Drone ──
  const startDrone = () => {
    if (droneActive) return
    setDroneActive(true); addLog('🛸 Drone launched')
    let r = 0, c = 0
    droneIntervalRef.current = setInterval(() => {
      setDronePos({ row: r, col: c }); c++
      if (c >= GRID_COLS) { c = 0; r++ }
      if (r >= GRID_ROWS) { clearInterval(droneIntervalRef.current); setDroneActive(false); addLog('🛸 Drone complete') }
    }, 400)
  }
  useEffect(() => () => { if (droneIntervalRef.current) clearInterval(droneIntervalRef.current) }, [])

  // ── Clear ──
  const clearAll = async () => {
    await fetch('/iot/trees', { method: 'DELETE' })
    setTrees([]); setStats(null); setScanResult(null); setHistory([]); setScanLog([])
    addLog('🗑️ Cleared')
  }

  const getGridStatus = (r, c) => {
    const i = r * GRID_COLS + c
    return i < trees.length ? (trees[i].disease === 'Healthy_Leaves' ? 'healthy' : 'diseased') : 'empty'
  }

  const wsColor = wsStatus === 'connected' ? 'var(--iot-green)' : wsStatus === 'error' ? 'var(--iot-red)' : 'var(--muted)'

  return (
    <div className="iotDashboard">
      {/* HEADER */}
      <div className="iotHeader">
        <div className="iotHeaderLeft">
          <div className="iotHeaderIcon"><Cpu size={22} /></div>
          <div>
            <h1 className="iotTitle">IoT Farm Dashboard</h1>
            <p className="iotSubtitle">Real-Time • RFID • GPS • Drone • WebSocket</p>
          </div>
        </div>
        <div className="iotHeaderActions">
          <div className="iotDeviceStatus">
            <Signal size={14} style={{ color: wsColor }} />
            <span className="iotDeviceLabel" style={{ color: wsColor }}>
              {wsStatus === 'connected' ? 'Live' : wsStatus === 'error' ? 'Error' : 'Offline'}
            </span>
            {wsClients > 0 && <span className="iotClientCount">{wsClients} client{wsClients > 1 ? 's' : ''}</span>}
            {livePulse && <span className="iotLiveDot iotPulse" />}
          </div>
          {wsStatus !== 'connected' && (
            <button className="iotBtn iotBtnOutline" onClick={fetchData}>Sync</button>
          )}
          <button className="iotBtn iotBtnDanger" onClick={clearAll}><Trash2 size={14} /> Reset</button>
        </div>
      </div>

      {/* STATS */}
      <div className="iotStatsBar">
        {[
          { icon: <TreePine size={18}/>, val: stats?.total_trees ?? 0, lbl: 'Total Trees', bg: 'rgba(37,99,235,0.1)', clr: 'var(--iot-blue)' },
          { icon: <CheckCircle2 size={18}/>, val: stats?.healthy ?? 0, lbl: 'Healthy', bg: 'rgba(22,163,74,0.1)', clr: 'var(--iot-green)' },
          { icon: <AlertTriangle size={18}/>, val: stats?.diseased ?? 0, lbl: 'Diseased', bg: 'rgba(220,38,38,0.1)', clr: 'var(--iot-red)' },
          { icon: <Signal size={18}/>, val: wsClients, lbl: 'Clients', bg: 'rgba(168,85,247,0.1)', clr: '#a855f7' },
        ].map((s, i) => (
          <div key={i} className="iotStat">
            <div className="iotStatIcon" style={{ background: s.bg, color: s.clr }}>{s.icon}</div>
            <div><div className="iotStatValue">{s.val}</div><div className="iotStatLabel">{s.lbl}</div></div>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="iotMainGrid">
        {/* LEFT */}
        <div className="iotControlPanel">
          {/* RFID */}
          <div className="iotCard">
            <div className="iotCardHeader">
              <Radio size={16} className="iotCardIcon" /><span>RFID Scanner (ESP32 + RC522)</span>
              <Circle size={8} fill={wsColor} stroke="none" style={{ marginLeft: 'auto' }} />
            </div>
            <div className="iotCardBody">
              <button className="iotBtn iotBtnPrimary iotBtnFull" onClick={generateUID}>
                <Zap size={15} /> Scan RFID Tag
              </button>
              {autoUid && <div className="iotUidDisplay"><span className="iotUidLabel">UID:</span><code className="iotUidCode">{autoUid}</code></div>}
            </div>
          </div>

          {/* GPS */}
          <div className="iotCard">
            <div className="iotCardHeader">
              <MapPin size={16} className="iotCardIcon" /><span>GPS Module</span>
              {gpsLocation ? <Wifi size={14} style={{ color: 'var(--iot-green)', marginLeft: 'auto' }} /> : <WifiOff size={14} style={{ color: 'var(--muted)', marginLeft: 'auto' }} />}
            </div>
            <div className="iotCardBody">
              <button className="iotBtn iotBtnOutline iotBtnFull" onClick={getGPS} disabled={gpsLoading}>
                <Crosshair size={15} /> {gpsLoading ? 'Acquiring...' : 'Get Location'}
              </button>
              {gpsLocation && <div className="iotGpsDisplay"><Navigation size={12} /><span>{gpsLocation.lat.toFixed(5)}, {gpsLocation.lng.toFixed(5)}</span></div>}
            </div>
          </div>

          {/* Drone */}
          <div className="iotCard">
            <div className="iotCardHeader">
              <Plane size={16} className="iotCardIcon" /><span>Drone Capture</span>
              {droneActive && <span className="iotLiveDot iotPulse" style={{ marginLeft: 'auto' }} />}
            </div>
            <div className="iotCardBody">
              <button className={`iotBtn ${droneActive ? 'iotBtnActive' : 'iotBtnOutline'} iotBtnFull`} onClick={startDrone} disabled={droneActive}>
                <Plane size={15} /> {droneActive ? 'Scanning...' : 'Launch Drone'}
              </button>
              <div className="iotUploadRow"><span className="iotDividerText">or upload image</span></div>
              <button className="iotBtn iotBtnOutline iotBtnFull" onClick={() => fileInputRef.current?.click()}>
                <Upload size={15} /> Upload Image
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              {previewUrl && <img src={previewUrl} alt="Captured" className="iotPreviewImg" />}
            </div>
          </div>

          {/* Scan */}
          <button className="iotBtn iotBtnScan" onClick={handleScan} disabled={scanning || !selectedFile}>
            {scanning ? <><div className="iotSpinner" /> Processing...</> : <><Radar size={18} /> Run Full IoT Scan</>}
          </button>

          {/* Result */}
          {scanResult && (
            <div className="iotResultCard" style={{ borderColor: statusColor(scanResult.disease) }}>
              <div className="iotResultHeader">
                <span className="iotResultTreeId">{scanResult.tree_id}</span>
                <span className="iotResultBadge" style={{ background: statusColor(scanResult.disease) + '18', color: statusColor(scanResult.disease) }}>
                  {statusLabel(scanResult.disease)}
                </span>
              </div>
              <div className="iotResultBody">
                <div className="iotResultRow"><span>Disease</span><strong>{scanResult.disease.replace(/_/g, ' ')}</strong></div>
                <div className="iotResultRow"><span>Confidence</span><strong>{confPercent(scanResult.confidence)}</strong></div>
                {scanResult.location && <div className="iotResultRow"><span>Location</span><strong>{scanResult.location.lat.toFixed(4)}, {scanResult.location.lng.toFixed(4)}</strong></div>}
                <div className="iotResultRow"><span>Time</span><strong>{fmtTime(scanResult.last_scan)}</strong></div>
                {scanResult.smoothed && <div className="iotResultSmoothed"><Zap size={12} /> Smoothed</div>}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="iotDashboardRight">
          {/* LiDAR Grid */}
          <div className="iotCard">
            <div className="iotCardHeader"><Radar size={16} className="iotCardIcon" /><span>Farm Grid — LiDAR View</span></div>
            <div className="iotCardBody">
              <div className="iotFarmGrid">
                {Array.from({ length: GRID_ROWS }).map((_, r) => (
                  <div key={r} className="iotFarmRow">
                    {Array.from({ length: GRID_COLS }).map((_, c) => {
                      const st = getGridStatus(r, c), isDrone = droneActive && dronePos.row === r && dronePos.col === c
                      const idx = r * GRID_COLS + c, tree = idx < trees.length ? trees[idx] : null
                      return (
                        <div key={c} className={`iotFarmCell iotFarmCell--${st} ${isDrone ? 'iotFarmCell--drone' : ''}`}
                          title={tree ? `${tree.tree_id}: ${tree.disease}` : 'Empty'}>
                          {isDrone && <Plane size={14} className="iotDroneIcon" />}
                          {st !== 'empty' && !isDrone && <TreePine size={16} />}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="iotLegend">
                <span className="iotLegendItem"><span className="iotLegendDot iotLegendDot--healthy" /> Healthy</span>
                <span className="iotLegendItem"><span className="iotLegendDot iotLegendDot--diseased" /> Diseased</span>
                <span className="iotLegendItem"><span className="iotLegendDot iotLegendDot--empty" /> Empty</span>
              </div>
            </div>
          </div>

          {/* Trees */}
          <div className="iotCard">
            <div className="iotCardHeader"><TreePine size={16} className="iotCardIcon" /><span>Scanned Trees ({trees.length})</span></div>
            <div className="iotCardBody iotTreeList">
              {trees.length === 0 && <div className="iotEmptyState"><Radar size={28} /><p>No trees scanned yet.</p></div>}
              {trees.map((tree) => (
                <div key={tree.tree_id} className="iotTreeItem">
                  <div className="iotTreeItemHeader" onClick={() => setExpandedTree(expandedTree === tree.tree_id ? null : tree.tree_id)}>
                    <div className="iotTreeItemLeft">
                      <span className="iotTreeDot" style={{ background: statusColor(tree.disease) }} />
                      <span className="iotTreeId">{tree.tree_id}</span>
                      <span className="iotTreeDisease">{tree.disease.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="iotTreeItemRight">
                      <span className="iotTreeConf">{confPercent(tree.confidence)}</span>
                      {expandedTree === tree.tree_id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                  {expandedTree === tree.tree_id && (
                    <div className="iotTreeItemExpanded">
                      <div className="iotTreeDetail"><span>UID</span><code>{tree.uid}</code></div>
                      <div className="iotTreeDetail"><span>Status</span><strong style={{ color: statusColor(tree.disease) }}>{statusLabel(tree.disease)}</strong></div>
                      <div className="iotTreeDetail"><span>Confidence</span><span>{confPercent(tree.confidence)}</span></div>
                      {tree.location && <div className="iotTreeDetail"><span>GPS</span><span>{tree.location.lat.toFixed(5)}, {tree.location.lng.toFixed(5)}</span></div>}
                      <div className="iotTreeDetail"><span>Last Scan</span><span>{fmtTime(tree.last_scan)}</span></div>
                      <div className="iotTreeDetail"><span>Time Ago</span><span>{timeAgo(tree.last_scan)}</span></div>
                      <div className="iotTreeDetail"><span>Scans</span><span>{tree.scan_count}</span></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scan History */}
          <div className="iotCard">
            <div className="iotCardHeader"><History size={16} className="iotCardIcon" /><span>Scan History ({history.length})</span></div>
            <div className="iotCardBody iotHistoryBody">
              {history.length === 0 && <div className="iotEmptyState small"><p>No scan history yet.</p></div>}
              {history.map((h) => (
                <div key={h.id} className="iotHistoryEntry">
                  <span className="iotTreeDot" style={{ background: statusColor(h.disease), flexShrink: 0 }} />
                  <div className="iotHistoryInfo">
                    <span className="iotHistoryTree">{h.tree_id}</span>
                    <span className="iotHistoryDisease">{h.disease.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="iotHistoryMeta">
                    <span className="iotHistoryConf">{confPercent(h.confidence)}</span>
                    <span className="iotHistoryTime"><Clock size={10} /> {timeAgo(h.scanned_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="iotCard">
            <div className="iotCardHeader"><Activity size={16} className="iotCardIcon" /><span>Activity Log</span></div>
            <div className="iotCardBody iotLogBody">
              {scanLog.length === 0 && <div className="iotEmptyState small"><p>Waiting for activity...</p></div>}
              {scanLog.map((entry, i) => (
                <div key={i} className="iotLogEntry">
                  <span className="iotLogTime">{entry.time}</span>
                  <span className="iotLogMsg">{entry.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
