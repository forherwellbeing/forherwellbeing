import { useState } from 'react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Btn from '../../components/ui/Button'
import { FF, Input, Sel, Textarea2 } from '../../components/ui/FormField'
import { CONSULTATIONS, PATIENTS } from '../../data'

export default function DoctorConsultations({ T }) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <Btn variant="primary" T={T} onClick={() => setShowAdd(true)}>+ Add Consultation Note</Btn>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {CONSULTATIONS.map(c => (
          <div key={c.id} style={{ background:'#fff', borderRadius:14, padding:'18px 20px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)', display:'flex', gap:14, alignItems:'flex-start' }}>
            <Avatar name={c.patient} size={42} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:7 }}>
                <div>
                  <span style={{ fontWeight:600, fontSize:14 }}>{c.patient}</span>
                  <span style={{ fontSize:12.5, color:'#7A7A8A', marginLeft:10 }}>{c.date} · {c.time}</span>
                </div>
                <div style={{ display:'flex', gap:7, alignItems:'center' }}>
                  <span style={{ fontSize:11.5, color:'#7A7A8A', background:'#FAF8F5', padding:'3px 9px', borderRadius:20 }}>{c.type}</span>
                  <Badge text={c.status} />
                </div>
              </div>
              {c.notes
                ? <div style={{ fontSize:13.5, lineHeight:1.65, background:'#FAFAFA', borderRadius:9, padding:'10px 13px', border:'1px solid #EDE8E5' }}>{c.notes}</div>
                : <div style={{ fontSize:13, color:'#7A7A8A', fontStyle:'italic' }}>No notes yet — consultation is upcoming.</div>
              }
            </div>
          </div>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Consultation Note">
        <FF label="Patient *">
          <Sel><option value="">Select patient…</option>{PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}</Sel>
        </FF>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FF label="Date *"><Input type="date" defaultValue="2026-04-27" /></FF>
          <FF label="Time *"><Input type="time" defaultValue="10:00" /></FF>
        </div>
        <FF label="Type"><Sel><option>Follow-up</option><option>Initial</option><option>Emergency</option></Sel></FF>
        <FF label="Notes *"><Textarea2 rows={5} placeholder="Enter observations, recommendations, dietary adjustments…" /></FF>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn variant="ghost" T={T} onClick={() => setShowAdd(false)}>Cancel</Btn>
          <Btn variant="primary" T={T} onClick={() => setShowAdd(false)}>Save Note</Btn>
        </div>
      </Modal>
    </div>
  )
}
