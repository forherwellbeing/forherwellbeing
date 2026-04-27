import Avatar from './ui/Avatar'

const DOCTOR_NAV = [
  { id:'overview',      icon:'⊞', label:'Dashboard' },
  { id:'patients',      icon:'♀', label:'Patients' },
  { id:'consultations', icon:'✦', label:'Consultations' },
  { id:'prescriptions', icon:'⊡', label:'Prescriptions' },
  { id:'reports',       icon:'≡', label:'Reports' },
  { id:'profile',       icon:'◉', label:'Profile' },
]

const STAFF_NAV = [
  { id:'overview',     icon:'⊞', label:'Dashboard' },
  { id:'patients',     icon:'♀', label:'Patient Management' },
  { id:'appointments', icon:'◷', label:'Appointments' },
  { id:'billing',      icon:'₹', label:'Billing & Payments' },
  { id:'reports',      icon:'≡', label:'Reports' },
  { id:'profile',      icon:'◉', label:'Profile' },
]

export default function Sidebar({ role, activePage, setActivePage, onLogout, T }) {
  const nav      = role === 'doctor' ? DOCTOR_NAV : STAFF_NAV
  const userName = role === 'doctor' ? 'Dr. Raga Deepthi' : 'Staff Admin'
  const userSub  = role === 'doctor' ? 'PhD Metabolic Science' : 'Admin · Portal'

  return (
    <div style={{ width:238, background:T.sidebar, height:'100vh', display:'flex', flexDirection:'column', position:'fixed', left:0, top:0, zIndex:100 }}>
      <div style={{ padding:'22px 20px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#FAF8F5', lineHeight:1.2 }}>For Her</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontStyle:'italic', color:T.accent, lineHeight:1.2 }}>Wellbeing</div>
        <div style={{ marginTop:7, fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
          {role === 'doctor' ? 'Doctor Portal' : 'Staff Portal'}
        </div>
      </div>

      <nav style={{ flex:1, padding:'14px 10px', overflowY:'auto' }}>
        {nav.map(item => {
          const isActive = activePage === item.id
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'10px 12px', borderRadius:10, border:'none', cursor:'pointer', background:isActive?'rgba(255,255,255,0.1)':'transparent', color:isActive?'#FAF8F5':'rgba(255,255,255,0.52)', marginBottom:2, fontSize:13.5, fontWeight:isActive?600:400, textAlign:'left', fontFamily:'inherit', transition:'all 0.15s', borderLeft:isActive?`3px solid ${T.accent}`:'3px solid transparent' }}>
              <span style={{ fontSize:15, width:20, textAlign:'center' }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      <div style={{ padding:'14px 18px 20px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <Avatar name={userName} size={33} />
          <div>
            <div style={{ fontSize:12.5, fontWeight:600, color:'#FAF8F5', lineHeight:1.3 }}>{userName}</div>
            <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.36)' }}>{userSub}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width:'100%', padding:'7px', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.45)', fontSize:12.5, cursor:'pointer', fontFamily:'inherit' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
