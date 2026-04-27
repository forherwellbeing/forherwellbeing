import Btn from '../../components/ui/Button'

const ITEMS = [
  { title:'Monthly Consultation Summary', desc:'April 2026 — 48 consultations, 24 patients', date:'01 May 2026', icon:'📊' },
  { title:'Patient Progress Report',      desc:'All active patients — program outcomes',     date:'27 Apr 2026', icon:'📈' },
  { title:'Revenue Summary',              desc:'April 2026 — ₹4,25,000 collected',          date:'27 Apr 2026', icon:'💰' },
  { title:'PCOS Program Outcomes',        desc:'Q1 2026 — 12 patients completed',           date:'01 Apr 2026', icon:'✦'  },
]

export default function Reports({ T }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
      {ITEMS.map((r, i) => (
        <div key={i} style={{ background:'#fff', borderRadius:14, padding:22, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:16 }}>
            <div style={{ background:T.accentLight, borderRadius:11, padding:'12px', fontSize:22 }}>{r.icon}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:14 }}>{r.title}</div>
              <div style={{ fontSize:12.5, color:'#7A7A8A', marginTop:3 }}>{r.desc}</div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'#7A7A8A' }}>Generated {r.date}</span>
            <div style={{ display:'flex', gap:8 }}>
              <Btn size="sm" variant="secondary" T={T}>View</Btn>
              <Btn size="sm" variant="ghost" T={T}>↓ PDF</Btn>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
