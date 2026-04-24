import { BarChart3, Database, MonitorSmartphone, Sparkles, Users, GraduationCap } from 'lucide-react'
import { t } from '../i18n.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ProjectInfoPage() {
  const { lang } = useLanguage()

  return (
    <div>
      <div className="card" style={{ padding: 18 }}>
        <div className="sectionTitle" style={{ marginTop: 0 }}>
          {t(lang, 'project_title')}
        </div>
        <div className="muted" style={{ lineHeight: 1.75 }}>
          {t(lang, 'project_intro')}
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 18 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="row">
            <div style={{ fontWeight: 900 }}>{t(lang, 'project_purpose')}</div>
            <Sparkles size={18} />
          </div>
          <div className="muted" style={{ marginTop: 10, lineHeight: 1.75 }}>
            {t(lang, 'project_purpose_text')}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="row">
            <div style={{ fontWeight: 900 }}>{t(lang, 'project_tech_stack')}</div>
            <Database size={18} />
          </div>
          <div className="muted" style={{ marginTop: 10, lineHeight: 1.75 }}>
            {t(lang, 'project_tech_stack_text')}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="row">
            <div style={{ fontWeight: 900 }}>{t(lang, 'project_ui_lang')}</div>
            <MonitorSmartphone size={18} />
          </div>
          <div className="muted" style={{ marginTop: 10, lineHeight: 1.75 }}>
            {t(lang, 'project_ui_lang_text')}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="row">
            <div style={{ fontWeight: 900 }}>{t(lang, 'project_accuracy')}</div>
            <BarChart3 size={18} />
          </div>
          <div className="muted" style={{ marginTop: 10, lineHeight: 1.75 }}>
            {t(lang, 'project_accuracy_text')}
          </div>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 18 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="row">
            <div style={{ fontWeight: 900 }}>{t(lang, 'project_credits')}</div>
            <Users size={18} />
          </div>
          <div className="muted" style={{ marginTop: 10, lineHeight: 1.75 }}>
            {t(lang, 'project_credits_text')}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="row">
            <div style={{ fontWeight: 900 }}>{t(lang, 'project_guidance')}</div>
            <GraduationCap size={18} />
          </div>
          <div className="muted" style={{ marginTop: 10, lineHeight: 1.75 }}>
            {t(lang, 'project_guidance_text')}
          </div>
        </div>
      </div>
    </div>
  )
}
