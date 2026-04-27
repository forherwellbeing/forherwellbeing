const PALETTE = ['#B05A72','#5B8DD9','#52A67A','#D4854A','#7B6DD9','#C17B3A']

export default function Avatar({ name, size = 36 }) {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
  const color = PALETTE[name.charCodeAt(0) % PALETTE.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:color+'22', color, fontSize:size*0.37, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:`1.5px solid ${color}44`, flexShrink:0 }}>
      {initials}
    </div>
  )
}
