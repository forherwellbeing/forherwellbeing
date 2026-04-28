import { useState } from 'react'

export default function BarChart({ data, width = 440, height = 155, color = '#B05A72' }) {
  const [tooltip, setTooltip] = useState(null)
  const p = { t:8, r:8, b:24, l:8 }
  const w = width - p.l - p.r
  const h = height - p.t - p.b
  const max = Math.max(...data.map(d => d.v), 1) * 1.18
  const bw = (w / data.length) * 0.52

  return (
    <div style={{ position:'relative', width:'100%' }}>
      {tooltip && (
        <div style={{
          position:'absolute', left:`${(tooltip.px / width) * 100}%`, top:0,
          transform:'translateX(-50%)',
          background:'#1A1A2E', color:'#fff',
          borderRadius:8, padding:'7px 11px',
          fontSize:11.5, pointerEvents:'none',
          whiteSpace:'nowrap', zIndex:10,
          boxShadow:'0 4px 16px rgba(0,0,0,0.22)',
        }}>
          <div style={{ fontWeight:600, fontSize:13 }}>
            ₹{Number(tooltip.d.v).toLocaleString('en-IN')}
          </div>
          {tooltip.d.count != null && (
            <div style={{ color:'rgba(255,255,255,0.6)', marginTop:2 }}>
              {tooltip.d.count} patient{tooltip.d.count !== 1 ? 's' : ''}
            </div>
          )}
          <div style={{ color:'rgba(255,255,255,0.45)', fontSize:10.5, marginTop:1 }}>
            {tooltip.d.l}
          </div>
        </div>
      )}
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display:'block' }}>
        {data.map((d, i) => {
          const bh = (d.v / max) * h
          const x  = p.l + (i / data.length) * w + (w / data.length - bw) / 2
          const y  = p.t + h - bh
          const px = x + bw / 2
          const isHovered = tooltip?.i === i
          return (
            <g key={i}
              style={{ cursor:'pointer' }}
              onMouseEnter={() => setTooltip({ i, px, d })}
              onMouseLeave={() => setTooltip(null)}
            >
              <rect
                x={x} y={isHovered ? y - 3 : y}
                width={bw} height={isHovered ? bh + 3 : bh}
                rx={5} fill={color}
                opacity={isHovered ? 1 : 0.78}
                style={{ transition:'all 0.12s' }}
              />
              <text x={px} y={height - 5} textAnchor="middle" fontSize={10} fill="#7A7A8A">
                {d.l}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
