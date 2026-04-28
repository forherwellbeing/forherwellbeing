export default function StatCard({ icon, label, value, change, color }) {
  return (
    <div style={{ background:'#fff', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 14px rgba(0,0,0,0.05)' }}>
      <div style={{ background:color+'1C', borderRadius:11, padding:'9px 11px', display:'inline-flex', marginBottom:14, color:color }}>
        {icon}
      </div>
      <div style={{ fontSize:26, fontWeight:700, color:'#1A1A2E', lineHeight:1, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:13, color:'#7A7A8A' }}>{label}</div>
      {change && <div style={{ fontSize:12, color, marginTop:6, fontWeight:500 }}>{change}</div>}
    </div>
  )
}
