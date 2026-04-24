import { AlertTriangle, CheckCircle2, Download, Printer, XCircle } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getDiseaseInfo } from '../diseaseInfo.js'

function isHealthyLabel(label) {
  return String(label || '').toLowerCase().includes('healthy')
}

function pct(conf) {
  return Math.round(Number(conf) * 1000) / 10
}

// Convert a blob/object URL to a base64 data URL via canvas
async function toDataUrl(url) {
  if (!url) return null
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d').drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

// Build the shared HTML report markup (used by both PDF and print)
function buildReportHtml({ report, diseaseKey, confidence, lang, dataUrl, healthy }) {
  const primary  = healthy ? '#22c55e' : '#ef4444'
  const confPct  = pct(confidence)
  const status   = report?.status || (healthy ? 'Healthy' : 'Diseased')
  const dateStr  = new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })

  function section(title, items, color) {
    if (!Array.isArray(items) || items.length === 0) return ''
    return `
      <div style="margin-bottom:14px;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:${color};color:white;padding:9px 16px;font-size:11px;font-weight:700;letter-spacing:0.05em;">
          ${title.toUpperCase()}
        </div>
        <div style="background:#ffffff;">
          <ul style="margin:0;padding:12px 16px 12px 32px;line-height:1.85;font-size:13px;color:#334155;">
            ${items.map(i => `<li style="margin-bottom:2px;">${i}</li>`).join('')}
          </ul>
        </div>
      </div>`
  }

  return `
    <div style="font-family:Arial,'Noto Sans Devanagari','Noto Sans Tamil',sans-serif;background:#ffffff;width:794px;color:#0f172a;">

      <!-- Header -->
      <div style="background:${primary};color:white;padding:26px 32px;position:relative;overflow:hidden;">
        <div style="position:absolute;right:-24px;top:-24px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,0.12);"></div>
        <div style="position:absolute;right:60px;bottom:-10px;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,0.08);"></div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;opacity:0.85;margin-bottom:6px;">COCONUT DISEASE DETECTION SYSTEM</div>
        <div style="font-size:22px;font-weight:900;margin-bottom:5px;">Disease Analysis Report</div>
        <div style="font-size:11px;opacity:0.8;">Generated: ${dateStr} &nbsp;|&nbsp; Language: ${String(lang || 'en').toUpperCase()}</div>
      </div>

      <!-- Summary card -->
      <div style="margin:18px 18px 14px;background:#f8fafc;border-radius:10px;padding:16px;display:flex;gap:16px;align-items:flex-start;border:1px solid #e2e8f0;">
        ${dataUrl ? `<img src="${dataUrl}" style="width:130px;height:100px;object-fit:cover;border-radius:7px;border:2.5px solid ${primary};flex-shrink:0;" />` : ''}
        <div style="flex:1;">
          <div style="font-size:9px;font-weight:700;letter-spacing:0.06em;color:#94a3b8;margin-bottom:3px;">PREDICTED CLASS</div>
          <div style="font-size:20px;font-weight:900;margin-bottom:8px;">${diseaseKey ?? 'N/A'}</div>
          <div style="display:inline-block;background:${primary};color:white;border-radius:20px;padding:3px 14px;font-size:11px;font-weight:700;margin-bottom:10px;">${status}</div>
          <div style="font-size:9px;font-weight:700;color:#94a3b8;margin-bottom:4px;letter-spacing:0.04em;">CONFIDENCE</div>
          <div style="height:7px;background:#e2e8f0;border-radius:99px;overflow:hidden;width:220px;">
            <div style="height:100%;background:${primary};border-radius:99px;width:${confPct}%;"></div>
          </div>
          <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:5px;">${confPct}%</div>
        </div>
      </div>

      <!-- Report sections -->
      <div style="margin:0 18px 18px;">
        ${section('Likely Cause',  report?.cause,                     '#3b82f6')}
        ${section('Symptoms',      report?.symptoms,                   '#a855f7')}
        ${section('Remedies',      report?.remedy || report?.remedies, '#f97316')}
        ${section('Prevention',    report?.prevention,                 '#14b8a6')}
        ${section('Fertilizers',   report?.fertilizers,                '#eab308')}
        <div style="background:#f1f5f9;border-radius:8px;padding:12px 16px;font-size:11px;color:#64748b;line-height:1.6;margin-top:4px;">
          ⚠️ This report is generated by the Coconut Disease Detection System.
          For professional agricultural advice, please consult a qualified expert.
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f1f5f9;border-top:2px solid ${primary};padding:10px 18px;text-align:center;font-size:10px;color:#94a3b8;">
        Coconut Disease Detection System &nbsp;|&nbsp; ${new Date().getFullYear()}
      </div>
    </div>`
}

// ── PDF download: renders HTML via html2canvas → jsPDF (supports all languages)
async function generatePDF({ report, diseaseKey, confidence, lang, imageUrl, healthy }) {
  const dataUrl = await toDataUrl(imageUrl)

  const html = buildReportHtml({ report, diseaseKey, confidence, lang, dataUrl, healthy })

  // Mount hidden container
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;top:-99999px;left:-99999px;width:794px;background:#fff;'
  container.innerHTML = html
  document.body.appendChild(container)

  try {
    // Render to canvas at 2× for crispness
    const canvas = await html2canvas(container.firstElementChild, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    const imgData  = canvas.toDataURL('image/jpeg', 0.92)
    const pdf      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pdfW     = pdf.internal.pageSize.getWidth()
    const pdfH     = pdf.internal.pageSize.getHeight()
    const imgH     = (canvas.height * pdfW) / canvas.width

    let remaining = imgH
    let yPos      = 0

    pdf.addImage(imgData, 'JPEG', 0, yPos, pdfW, imgH)
    remaining -= pdfH

    while (remaining > 0) {
      pdf.addPage()
      yPos -= pdfH
      pdf.addImage(imgData, 'JPEG', 0, yPos, pdfW, imgH)
      remaining -= pdfH
    }

    const safeName = String(diseaseKey || 'report').replace(/\s+/g, '_')
    pdf.save(`${safeName}_report_${String(lang || 'en').toLowerCase()}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}

// ── Print: opens styled HTML in new tab → browser print dialog
async function printReport({ report, diseaseKey, confidence, lang, imageUrl, healthy }) {
  const dataUrl = await toDataUrl(imageUrl)
  const body    = buildReportHtml({ report, diseaseKey, confidence, lang, dataUrl, healthy })

  const page = `<!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <title>Disease Report — ${diseaseKey}</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #f8fafc; display: flex; justify-content: center; padding: 20px; }
      @media print {
        body { background: white; padding: 0; }
      }
    </style>
  </head><body>
    ${body}
    <script>
      window.onload = function() {
        setTimeout(function() { window.print() }, 400)
      }
    <\/script>
  </body></html>`

  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(page)
  w.document.close()
}

// ═══════════════════════════════════════════════════════════════════════════════

export default function PredictionResultCard({ result, imageUrl }) {
  if (!result) return null

  const { lang } = useLanguage()

  const info = getDiseaseInfo(result.disease, lang, null)
  let report = info || result.report
  if (result.report?.fertilizers && (!report?.fertilizers || report.fertilizers.length === 0)) {
    report = { ...report, fertilizers: result.report.fertilizers }
  }

  const confidence = Number(result.confidence ?? 0)
  const healthy    = isHealthyLabel(result.disease)
  const badgeClass = healthy ? 'badgeHealthy' : 'badgeDiseased'
  const Icon       = healthy ? CheckCircle2 : XCircle
  const fillColor  = healthy ? 'var(--green)' : 'var(--red)'
  const statusText = report?.status || (healthy ? 'Healthy' : 'Diseased')

  async function onDownload() {
    await generatePDF({ report, diseaseKey: result.disease, confidence: result.confidence, lang, imageUrl, healthy })
  }

  async function onPrint() {
    await printReport({ report, diseaseKey: result.disease, confidence: result.confidence, lang, imageUrl, healthy })
  }

  return (
    <section className="card" style={{ padding: 18 }} aria-label="Prediction result">
      <div className="row">
        <div>
          <div className="muted" style={{ fontWeight: 800, fontSize: 12, letterSpacing: '0.02em' }}>
            {t(lang, 'prediction_result')}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>
            {info?.label || result.disease}
          </div>
        </div>

        <div className={`badge ${badgeClass}`}>
          <Icon size={16} />
          {statusText}
        </div>
      </div>

      <div className="progressWrap">
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="muted" style={{ fontWeight: 800, fontSize: 13 }}>
            {t(lang, 'confidence')}
          </div>
          <div style={{ fontWeight: 900 }}>
            {pct(confidence)}%
          </div>
        </div>
        <div className="progressBar" role="progressbar" aria-valuenow={pct(confidence)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="progressFill"
            style={{ width: `${Math.min(100, Math.max(0, confidence * 100))}%`, background: fillColor }}
          />
        </div>

        {confidence < 0.6 ? (
          <div className="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={18} />
              <div>{t(lang, 'low_conf_warning')}</div>
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <div className="row" style={{ marginBottom: 10 }}>
          <div className="muted" style={{ fontWeight: 900, fontSize: 13 }}>
            {t(lang, 'disease_report')}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" type="button" onClick={onDownload}>
              <Download size={18} />
              {t(lang, 'download_report')}
            </button>
            <button className="btn" type="button" onClick={onPrint}>
              <Printer size={18} />
              {t(lang, 'print')}
            </button>
          </div>
        </div>

        <div className="grid2">
          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'likely_cause')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.cause) && report.cause.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.cause.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              ) : 'Not available.'}
            </div>
          </div>

          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'symptoms')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.symptoms) && report.symptoms.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : 'Not available.'}
            </div>
          </div>

          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'remedies')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.remedy) && report.remedy.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.remedy.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              ) : Array.isArray(report?.remedies) && report.remedies.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.remedies.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              ) : 'Not available.'}
            </div>
          </div>

          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'prevention')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.prevention) && report.prevention.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.prevention.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              ) : 'Not available.'}
            </div>
          </div>

          <div className="card" style={{ padding: 14, boxShadow: 'none' }}>
            <div className="muted" style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>
              {t(lang, 'fertilizers')}
            </div>
            <div className="muted" style={{ lineHeight: 1.7 }}>
              {Array.isArray(report?.fertilizers) && report.fertilizers.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {report.fertilizers.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              ) : 'Not available.'}
            </div>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 12, lineHeight: 1.65, fontSize: 13 }}>
          {t(lang, 'note_report')}
        </div>
      </div>
    </section>
  )
}
