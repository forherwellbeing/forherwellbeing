export default function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(20,5,15,0.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(2px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:width, maxHeight:'90vh', overflow:'auto', boxShadow:'0 32px 100px rgba(0,0,0,0.25)' }}>
        <div style={{ padding:'22px 26px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:'#1A1A2E' }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:'#7A7A8A', lineHeight:1, padding:4 }}>×</button>
        </div>
        <div style={{ padding:26 }}>{children}</div>
      </div>
    </div>
  )
}
