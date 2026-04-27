import { useState } from 'react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Btn from '../../components/ui/Button'
import { FF, Input, Sel, Textarea2 } from '../../components/ui/FormField'
import { APPOINTMENTS, PATIENTS } from '../../data'

const FILTERS = ['All','Today','Upcoming','Pending']

export default function StaffAppointments({ T }) {
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter]   = useState('All')

  const filtered = APPOINTMENTS.filter(a => {
    if (filter === 'All')      return true
    if (filter === 'Today')    return a.date.includes('27 Apr')
    if (filter === 'Pending')  return a.status === 'Pending'
    if (filter === 'Upcoming') return a.date.includes('28 Apr')
    return true
  })

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, alignItems:'center' }}>
        <div style={{ display:'flex', gap:8 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 16px', borderRadius:20, border:`1.5px solid ${filter===f?T.accent:'#EDE8E5'}`, background:filter===f?T.accentLight:'white', color:filter===f?T.accent:'#7A7A8A', fontSize:13, cursor:'pointer', fontFamily:'inherit', fontWeight:filter===f?600:400 }}>
              {f}
            </button>
          ))}
        </div>
        <Btn variant="primary" T={T} onClick={() => setShowAdd(true)}>+ Schedule</Btn>
      </div>

      <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 14px rgba(0,0,0,0.05)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#FAFAFA', borderBottom:'1px solid #EDE8E5' }}>
              {['Patient','Doctor','Date','Time','Type','Status',''].map(h => (
                <th key={h} style={{ padding:'11px 15px', textAlign:'left', fontSize:11.5, fontWeight:600, color:'#7A7A8A', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} style={{ borderBottom:'1px solid #EDE8E5' }}>
                <td style={{ padding:'13px 15px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Avatar name={a.patient} size={31} />
                    <span style={{ fontWeight:500, fontSize:13.5 }}>{a.patient}</span>
                  </div>
                </td>
                <td style={{ padding:'13px 15px', fontSize:12.5, color:'#7A7A8A' }}>{a.doctor}</td>
                <td style={{ padding:'13px 15px', fontSize:14, fontWeight:500 }}>{a.date}</td>
                <td style={{ padding:'13px 15px', fontSize:14, fontWeight:500 }}>{a.time}</td>
                <td style={{ padding:'13px 15px', fontSize:12.5, color:'#7A7A8A' }}>{a.type}</td>
                <td style={{ padding:'13px 15px' }}><Badge text={a.status} /></td>
                <td style={{ padding:'13px 15px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <Btn size="sm" variant="secondary" T={T}>Edit</Btn>
                    <Btn size="sm" variant="ghost"     T={T}>Cancel</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Schedule Appointment">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FF label="Patient *"><Sel><option value="">Select patient…</option>{PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}</Sel></FF>
          <FF label="Doctor"><Sel><option>Dr. Raga Deepthi</option></Sel></FF>
          <FF label="Date *"><Input type="date" defaultValue="2026-04-28" /></FF>
          <FF label="Time *"><Input type="time" defaultValue="10:00" /></FF>
        </div>
        <FF label="Type"><Sel><option>Initial</option><option>Follow-up</option><option>Emergency</option></Sel></FF>
        <FF label="Notes"><Textarea2 rows={3} placeholder="Any special notes…" /></FF>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn variant="ghost"   T={T} onClick={() => setShowAdd(false)}>Cancel</Btn>
          <Btn variant="primary" T={T} onClick={() => setShowAdd(false)}>Schedule</Btn>
        </div>
      </Modal>
    </div>
  )
}
