const fmt = t => {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`
}

const MORNING   = []
const AFTERNOON = []

for (let h = 9;  h < 13; h++) { MORNING.push(`${String(h).padStart(2,'0')}:00`);   MORNING.push(`${String(h).padStart(2,'0')}:30`) }
for (let h = 13; h < 18; h++) { AFTERNOON.push(`${String(h).padStart(2,'0')}:00`); AFTERNOON.push(`${String(h).padStart(2,'0')}:30`) }

function SlotGroup({ slots, booked, selected, onChange, accent, accentLight }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7 }}>
      {slots.map(slot => {
        const isBooked   = booked.includes(slot)
        const isSelected = selected === slot
        return (
          <button
            key={slot}
            type="button"
            disabled={isBooked}
            onClick={() => onChange(slot)}
            style={{
              padding:'8px 4px',
              borderRadius:8,
              border: isSelected ? `2px solid ${accent}` : `1.5px solid ${isBooked ? '#F0EDEB' : '#EDE8E5'}`,
              background: isBooked ? '#F9F7F6' : isSelected ? accentLight : '#fff',
              color: isBooked ? '#C8C0BB' : isSelected ? accent : '#1A1A2E',
              fontSize:12,
              fontWeight: isSelected ? 700 : 400,
              cursor: isBooked ? 'not-allowed' : 'pointer',
              fontFamily:'inherit',
              transition:'all 0.12s',
              position:'relative',
              textDecoration: isBooked ? 'line-through' : 'none',
            }}
          >
            {fmt(slot)}
            {isBooked && (
              <span style={{ position:'absolute', top:3, right:4, fontSize:8, color:'#C8C0BB', fontWeight:700 }}>✕</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function SlotPicker({ bookedTimes = [], selected, onChange, T }) {
  const accent      = T?.accent      || '#B05A72'
  const accentLight = T?.accentLight || '#F4E8EC'

  return (
    <div>
      <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:10 }}>
        <div style={{ width:8, height:8, borderRadius:2, background:accent }} />
        <span style={{ fontSize:11, color:'#7A7A8A', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em' }}>Morning — 9:00 AM to 12:30 PM</span>
      </div>
      <SlotGroup slots={MORNING} booked={bookedTimes} selected={selected} onChange={onChange} accent={accent} accentLight={accentLight} />

      <div style={{ display:'flex', gap:6, alignItems:'center', margin:'14px 0 10px' }}>
        <div style={{ width:8, height:8, borderRadius:2, background:'#5B8DD9' }} />
        <span style={{ fontSize:11, color:'#7A7A8A', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em' }}>Afternoon — 1:00 PM to 5:30 PM</span>
      </div>
      <SlotGroup slots={AFTERNOON} booked={bookedTimes} selected={selected} onChange={onChange} accent={accent} accentLight={accentLight} />

      {selected && (
        <div style={{ marginTop:12, padding:'8px 12px', background:accentLight, borderRadius:8, fontSize:13, color:accent, fontWeight:500 }}>
          Selected: {fmt(selected)}
        </div>
      )}
    </div>
  )
}
