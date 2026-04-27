import { useState, useCallback, useRef, useEffect } from 'react'

const STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:260px;
    display:flex;flex-direction:column;
    background:rgba(250,249,247,.88);color:#29261b;
    backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none;border-bottom:1px solid rgba(0,0,0,0.06)}
  .twk-hd b{font-size:12px;font-weight:600}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:pointer;font-size:13px}
  .twk-x:hover{background:rgba(0,0,0,.06)}
  .twk-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:10px}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:6px 0 2px}
  .twk-row-h{display:flex;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{font-size:11.5px;font-weight:500;color:rgba(41,38,27,.72)}
  .twk-swatch{appearance:none;width:52px;height:22px;border:.5px solid rgba(0,0,0,.1);
    border-radius:6px;padding:0;cursor:pointer;background:transparent}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s,width .15s}
  .twk-seg button{position:relative;z-index:1;flex:1;border:0;background:transparent;
    font:inherit;font-weight:500;font-size:11px;min-height:22px;border-radius:6px;
    cursor:pointer;padding:3px 6px}
`

function TweakColor({ label, value, onChange }) {
  return (
    <div className="twk-row-h">
      <span className="twk-lbl">{label}</span>
      <input type="color" className="twk-swatch" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = useRef(null)
  const opts = options.map(o => typeof o === 'object' ? o : { value: o, label: o })
  const idx = Math.max(0, opts.findIndex(o => o.value === value))
  const n = opts.length
  const valueRef = useRef(value)
  valueRef.current = value

  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect()
    const i = Math.floor(((clientX - r.left - 2) / (r.width - 4)) * n)
    return opts[Math.max(0, Math.min(n - 1, i))].value
  }

  const onPointerDown = e => {
    const v0 = segAt(e.clientX)
    if (v0 !== valueRef.current) onChange(v0)
    const move = ev => { const v = segAt(ev.clientX); if (v !== valueRef.current) onChange(v) }
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      <span className="twk-lbl">{label}</span>
      <div ref={trackRef} className="twk-seg" onPointerDown={onPointerDown}>
        <div className="twk-seg-thumb" style={{ left:`calc(2px + ${idx} * (100% - 4px) / ${n})`, width:`calc((100% - 4px) / ${n})` }} />
        {opts.map(o => <button key={o.value} type="button">{o.label}</button>)}
      </div>
    </div>
  )
}

export default function TweaksPanel({ tweaks, setTweak }) {
  const [open, setOpen] = useState(false)
  const dragRef = useRef(null)
  const offsetRef = useRef({ x:16, y:16 })

  const clamp = useCallback(() => {
    const panel = dragRef.current
    if (!panel) return
    const maxR = Math.max(16, window.innerWidth - panel.offsetWidth - 16)
    const maxB = Math.max(16, window.innerHeight - panel.offsetHeight - 16)
    offsetRef.current = { x: Math.min(maxR, Math.max(16, offsetRef.current.x)), y: Math.min(maxB, Math.max(16, offsetRef.current.y)) }
    panel.style.right  = offsetRef.current.x + 'px'
    panel.style.bottom = offsetRef.current.y + 'px'
  }, [])

  useEffect(() => { if (open) clamp() }, [open, clamp])

  const onDragStart = e => {
    const panel = dragRef.current
    if (!panel) return
    const r = panel.getBoundingClientRect()
    const sx = e.clientX, sy = e.clientY
    const sr = window.innerWidth - r.right, sb = window.innerHeight - r.bottom
    const move = ev => { offsetRef.current = { x: sr - (ev.clientX - sx), y: sb - (ev.clientY - sy) }; clamp() }
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{ position:'fixed', right:16, bottom:16, zIndex:2147483646, background:'rgba(176,90,114,0.92)', color:'#fff', border:'none', borderRadius:10, padding:'8px 14px', fontSize:12, fontWeight:600, cursor:'pointer', backdropFilter:'blur(8px)', boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
        🎨 Tweaks
      </button>
    )
  }

  return (
    <>
      <style>{STYLE}</style>
      <div ref={dragRef} className="twk-panel" style={{ right:offsetRef.current.x, bottom:offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>Tweaks</b>
          <button className="twk-x" onMouseDown={e => e.stopPropagation()} onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="twk-body">
          <div className="twk-sect">Branding</div>
          <TweakColor label="Accent Color"  value={tweaks.accentColor}  onChange={v => setTweak('accentColor', v)} />
          <TweakColor label="Sidebar Color" value={tweaks.sidebarColor} onChange={v => setTweak('sidebarColor', v)} />
          <div className="twk-sect">Layout</div>
          <TweakRadio label="Density" value={tweaks.density} options={['comfortable','compact']} onChange={v => setTweak('density', v)} />
        </div>
      </div>
    </>
  )
}
