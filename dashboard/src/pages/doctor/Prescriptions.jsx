import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import Btn from '../../components/ui/Button'
import { FF, Input, Sel, Textarea2 } from '../../components/ui/FormField'
import { PATIENTS } from '../../data'

const ITEMS = [
  { id:1, patient:'Priya Sharma',    date:'20 Apr 2026', title:'Anti-Inflammatory Protocol', type:'Diet Plan'       },
  { id:2, patient:'Ananya Reddy',    date:'22 Apr 2026', title:'Thyroid Support Supplements', type:'Supplement Plan' },
  { id:3, patient:'Meena Krishnan',  date:'18 Apr 2026', title:'Low-Glycemic Meal Plan',      type:'Diet Plan'       },
  { id:4, patient:'Divyasree Kumar', date:'15 Apr 2026', title:'PCOS Reversal Protocol',      type:'Full Protocol'   },
]

export default function DoctorPrescriptions({ T }) {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <Btn variant="primary" T={T} onClick={() => setShowUpload(true)}>+ Upload Prescription</Btn>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:13 }}>
        {ITEMS.map(item => (
          <div key={item.id} style={{ background:'#fff', borderRadius:14, padding:20, boxShadow:'0 2px 10px rgba(0,0,0,0.05)', display:'flex', gap:14 }}>
            <div style={{ background:T.accentLight, borderRadius:11, padding:'12px', fontSize:22, flexShrink:0 }}>📋</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:14 }}>{item.title}</div>
              <div style={{ fontSize:12.5, color:'#7A7A8A', marginTop:3 }}>{item.patient} · {item.date}</div>
              <div style={{ marginTop:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, background:T.accentLight, color:T.accent, padding:'3px 10px', borderRadius:20, fontWeight:500 }}>{item.type}</span>
                <Btn size="sm" variant="ghost" T={T}>↓ Download</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Prescription">
        <FF label="Patient *">
          <Sel><option value="">Select patient…</option>{PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}</Sel>
        </FF>
        <FF label="Title *"><Input placeholder="e.g. PCOS Diet Protocol Week 3" /></FF>
        <FF label="Type"><Sel><option>Diet Plan</option><option>Supplement Plan</option><option>Full Protocol</option><option>Yoga Sequence</option></Sel></FF>
        <FF label="Notes"><Textarea2 rows={3} placeholder="Additional instructions for patient…" /></FF>
        <div style={{ border:'2px dashed #EDE8E5', borderRadius:11, padding:'22px', textAlign:'center', marginBottom:14, cursor:'pointer', background:'#FAFAFA' }}>
          <div style={{ fontSize:22, marginBottom:6 }}>📎</div>
          <div style={{ fontSize:13.5, color:'#7A7A8A' }}>Drag & drop or click to browse</div>
          <div style={{ fontSize:12, color:'#7A7A8A', marginTop:3 }}>PDF, DOC, PNG — up to 10 MB</div>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn variant="ghost" T={T} onClick={() => setShowUpload(false)}>Cancel</Btn>
          <Btn variant="primary" T={T} onClick={() => setShowUpload(false)}>Upload</Btn>
        </div>
      </Modal>
    </div>
  )
}
