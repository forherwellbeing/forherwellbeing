export default function LineChart({ data, width = 360, height = 130, color = '#B05A72' }) {
  const p = { t:10, r:10, b:26, l:10 }
  const w = width - p.l - p.r
  const h = height - p.t - p.b
  const max = Math.max(...data.map(d => d.v)) * 1.12
  const pts = data.map((d, i) => [p.l + (i / (data.length - 1)) * w, p.t + h - (d.v / max) * h])
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `M${pts[0]} ${pts.slice(1).map(([x, y]) => `L${x},${y}`).join(' ')} L${p.l + w},${p.t + h} L${p.l},${p.t + h} Z`
  return (
    <svg width={width} height={height} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id="lcg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lcg)" />
      <polyline fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" points={line} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.5} fill={color} />)}
      {data.map((d, i) => <text key={i} x={pts[i][0]} y={height - 4} textAnchor="middle" fontSize={10} fill="#7A7A8A">{d.l}</text>)}
    </svg>
  )
}
