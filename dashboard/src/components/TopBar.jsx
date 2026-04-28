import { useState, useRef, useEffect } from 'react'
import Icon from './ui/Icon'

const fmtTime = t => new Date(t).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })

export default function TopBar({ title, role, notifications = [], unreadCount = 0, onMarkAllRead, isMobile, onMenuToggle }) {
  const [showNotifs, setShowNotifs] = useState(false)
  const bellRef = useRef(null)
  const today = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })

  useEffect(() => {
    const handler = e => { if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifs(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleBell = () => {
    setShowNotifs(v => !v)
    if (!showNotifs && unreadCount > 0) onMarkAllRead?.()
  }

  return (
    <div style={{ height:62, background:'#fff', borderBottom:'1px solid #EDE8E5', display:'flex', alignItems:'center', justifyContent:'space-between', padding:`0 ${isMobile ? 16 : 26}px`, position:'sticky', top:0, zIndex:50, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {isMobile && (
          <button onClick={onMenuToggle} style={{ width:36, height:36, background:'#FAF8F5', border:'1.5px solid #EDE8E5', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#1A1A2E', flexShrink:0 }}>
            <Icon name="menu" size={16} />
          </button>
        )}
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 15 : 18, fontWeight:600, color:'#1A1A2E' }}>{title}</div>
          {!isMobile && <div style={{ fontSize:11, color:'#7A7A8A' }}>For Her Wellbeing · {role === 'doctor' ? 'Doctor Portal' : 'Staff Portal'}</div>}
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {!isMobile && (
          <div style={{ fontSize:12, color:'#7A7A8A', background:'#FAF8F5', border:'1.5px solid #EDE8E5', borderRadius:8, padding:'5px 11px' }}>{today}</div>
        )}

        <div ref={bellRef} style={{ position:'relative' }}>
          <button onClick={handleBell} style={{ width:36, height:36, background:'#FAF8F5', border:'1.5px solid #EDE8E5', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#7A7A8A', position:'relative' }}>
            <Icon name="bell" size={15} />
            {unreadCount > 0 && (
              <span style={{ position:'absolute', top:3, right:3, width:16, height:16, background:'#D45B5B', borderRadius:'50%', fontSize:9, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{ position:'absolute', top:44, right:0, width: isMobile ? 'calc(100vw - 48px)' : 320, maxWidth:320, background:'#fff', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,0.14)', border:'1px solid #EDE8E5', zIndex:200, overflow:'hidden' }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid #EDE8E5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#1A1A2E' }}>New Bookings</span>
                {notifications.length > 0 && (
                  <button onClick={onMarkAllRead} style={{ fontSize:11, color:'#7A7A8A', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Clear all</button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding:'24px 16px', textAlign:'center', color:'#7A7A8A', fontSize:13 }}>No new bookings yet</div>
              ) : (
                <div style={{ maxHeight:320, overflowY:'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ display:'flex', gap:10, padding:'11px 16px', borderBottom:'1px solid #FAF8F5', background:n.read?'transparent':'#FFF8FA' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:n.read?'transparent':'#B05A72', marginTop:5, flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:500, color:'#1A1A2E' }}>{n.name}</div>
                        <div style={{ fontSize:11.5, color:'#7A7A8A', marginTop:2 }}>{n.program} · ₹{Number(n.amount).toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{ fontSize:10.5, color:'#7A7A8A', whiteSpace:'nowrap' }}>{fmtTime(n.time)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
