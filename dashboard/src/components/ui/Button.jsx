export default function Btn({ children, onClick, variant = 'primary', size = 'md', T: theme, style: x = {}, disabled }) {
  const accent = (theme || {}).accent || '#B05A72'
  const sz  = size === 'sm' ? '6px 13px' : size === 'lg' ? '12px 28px' : '9px 20px'
  const fsz = size === 'sm' ? 12.5 : size === 'lg' ? 15 : 13.5
  const vs = {
    primary:   { background:accent,      color:'#fff',     border:'none' },
    secondary: { background:accent+'1A', color:accent,     border:'none' },
    ghost:     { background:'transparent', color:'#7A7A8A', border:'1.5px solid #EDE8E5' },
    danger:    { background:'#FEE8E8',   color:'#D45B5B', border:'none' },
  }
  return (
    <button disabled={disabled} onClick={onClick} style={{ borderRadius:8, cursor:disabled?'not-allowed':'pointer', fontFamily:'inherit', fontWeight:600, fontSize:fsz, padding:sz, display:'inline-flex', alignItems:'center', gap:6, transition:'all 0.18s', opacity:disabled?0.5:1, ...vs[variant], ...x }}>
      {children}
    </button>
  )
}
