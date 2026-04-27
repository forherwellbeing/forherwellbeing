export default function BarChart({ data, width = 440, height = 155, color = '#B05A72' }) {
  const p = { t:8, r:8, b:24, l:8 }
  const w = width - p.l - p.r
  const h = height - p.t - p.b
  const max = Math.max(...data.map(d => d.v)) * 1.18
  const bw = (w / data.length) * 0.52
  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const bh = (d.v / max) * h
        const x = p.l + (i / data.length) * w + (w / data.length - bw) / 2
        const y = p.t + h - bh
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={5} fill={color} opacity={0.82} />
            <text x={x + bw / 2} y={height - 5} textAnchor="middle" fontSize={10} fill="#7A7A8A">{d.l}</text>
          </g>
        )
      })}
    </svg>
  )
}
