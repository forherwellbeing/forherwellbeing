export default function TopBar({ title, role }) {
  const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
  return (
    <div style={{ height:62, background:'#fff', borderBottom:'1px solid #EDE8E5', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 26px', position:'sticky', top:0, zIndex:50, flexShrink:0 }}>
      <div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:'#1A1A2E' }}>{title}</div>
        <div style={{ fontSize:11, color:'#7A7A8A' }}>For Her Wellbeing · {role === 'doctor' ? 'Doctor Portal' : 'Staff Portal'}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ position:'relative' }}>
          <input placeholder="Search…" style={{ background:'#FAF8F5', border:'1.5px solid #EDE8E5', borderRadius:20, padding:'7px 14px 7px 34px', fontSize:13, color:'#1A1A2E', width:185, outline:'none' }} />
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#7A7A8A', fontSize:14 }}>⌕</span>
        </div>
        <div style={{ position:'relative' }}>
          <div style={{ width:36, height:36, background:'#FAF8F5', border:'1.5px solid #EDE8E5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:15 }}>🔔</div>
          <div style={{ position:'absolute', top:3, right:3, width:7, height:7, background:'#D45B5B', borderRadius:'50%', border:'2px solid #fff' }} />
        </div>
        <div style={{ fontSize:12, color:'#7A7A8A', background:'#FAF8F5', border:'1.5px solid #EDE8E5', borderRadius:8, padding:'5px 11px' }}>{today}</div>
      </div>
    </div>
  )
}
