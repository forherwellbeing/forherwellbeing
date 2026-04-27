export default function DonutChart({ segs, size = 108 }) {
  const r = size * 0.38
  const cx = size / 2
  const cy = size / 2
  const total = segs.reduce((s, d) => s + d.v, 0)
  let ang = -Math.PI / 2
  const paths = segs.map(d => {
    const a0 = ang
    const da = (d.v / total) * Math.PI * 2
    ang += da
    const x1 = cx + r * Math.cos(a0), y1 = cy + r * Math.sin(a0)
    const x2 = cx + r * Math.cos(ang), y2 = cy + r * Math.sin(ang)
    return { d:`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${da > Math.PI ? 1 : 0},1 ${x2},${y2} Z`, color:d.color }
  })
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r * 0.6} fill="white" />
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
    </svg>
  )
}
