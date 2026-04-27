import { useState } from 'react'
import { usePatients } from '../../hooks/usePatients'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Btn from '../../components/ui/Button'
import { FF, Input, Sel } from '../../components/ui/FormField'

const BLANK = { name:'', email:'', phone:'', condition:'', program:'', patient_status:'Active' }

const fmt = (p) => ({
  id:        p.id,
  name:      p.name,
  contact:   p.phone,
  email:     p.email,
  condition: p.condition || p.program || '—',
  program:   p.program   || '—',
  status:    p.patient_status || 'Active',
  lastVisit: p.payment_date
    ? new Date(p.payment_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    : new Date(p.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
  paymentId: p.razorpay_payment_id,
  amountPaid: p.amount_paid,
})

export default function StaffPatients({ T }) {
  const { patients, loading, error, addPatient, updatePatient, deletePatient } = usePatients()
  const [search, setSearch]  = useState('')
  const [showModal, setShow] = useState(false)
  const [editPt, setEditPt]  = useState(null)
  const [form, setForm]      = useState(BLANK)
  const [saving, setSaving]  = useState(false)

  const rows     = patients.map(fmt)
  const filtered = rows.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const upd      = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    if (editPt) {
      await updatePatient(editPt.id, {
        name: form.name, email: form.email, phone: form.phone,
        condition: form.condition, program: form.program, patient_status: form.patient_status,
      })
    } else {
      await addPatient({
        name: form.name, email: form.email, phone: form.phone,
        condition: form.condition, program: form.program,
        patient_status: form.patient_status,
        payment_status: 'Manual', amount_paid: 0,
        payment_date: new Date().toISOString().split('T')[0],
        doctor: 'Dr. Raga Deepthi',
      })
    }
    setSaving(false)
    setShow(false); setEditPt(null); setForm(BLANK)
  }

  const openEdit = (row) => {
    const raw = patients.find(p => p.id === row.id)
    setEditPt(raw)
    setForm({ name:raw.name, email:raw.email||'', phone:raw.phone||'', condition:raw.condition||'', program:raw.program||'', patient_status:raw.patient_status||'Active' })
    setShow(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient record?')) await deletePatient(id)
  }

  if (error) return <div style={{ color:'#D45B5B', padding:20 }}>Error loading patients: {error}</div>

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:16, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients…" style={{ width:'100%', background:'#fff', border:'1.5px solid #EDE8E5', borderRadius:10, padding:'10px 14px 10px 36px', fontSize:13.5, outline:'none' }} />
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#7A7A8A' }}>⌕</span>
        </div>
        <Btn variant="primary" T={T} onClick={() => { setEditPt(null); setForm(BLANK); setShow(true) }}>+ Add Patient</Btn>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'#7A7A8A' }}>Loading patients…</div>
      ) : (
        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 14px rgba(0,0,0,0.05)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#FAFAFA', borderBottom:'1px solid #EDE8E5' }}>
                {['Patient','Contact','Program','Paid On','Amount','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'11px 15px', textAlign:'left', fontSize:11.5, fontWeight:600, color:'#7A7A8A', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#7A7A8A', fontSize:14 }}>No patients yet. They'll appear here after paying on the homepage.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom:'1px solid #EDE8E5' }}>
                  <td style={{ padding:'12px 15px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar name={p.name} size={31} />
                      <div>
                        <div style={{ fontWeight:500, fontSize:13.5 }}>{p.name}</div>
                        {p.email && <div style={{ fontSize:11.5, color:'#7A7A8A' }}>{p.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.contact}</td>
                  <td style={{ padding:'12px 15px', fontSize:12.5 }}>{p.program}</td>
                  <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.lastVisit}</td>
                  <td style={{ padding:'12px 15px', fontSize:13, fontWeight:600, color:'#52A67A' }}>
                    {p.amountPaid ? `₹${Number(p.amountPaid).toLocaleString()}` : '—'}
                  </td>
                  <td style={{ padding:'12px 15px' }}><Badge text={p.status} /></td>
                  <td style={{ padding:'12px 15px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <Btn size="sm" variant="secondary" T={T} onClick={() => openEdit(p)}>Edit</Btn>
                      <Btn size="sm" variant="danger"    T={T} onClick={() => handleDelete(p.id)}>Delete</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShow(false); setEditPt(null) }} title={editPt ? 'Edit Patient' : 'Add Patient Manually'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FF label="Full Name *"><Input value={form.name}  onChange={upd('name')}  placeholder="Full name" /></FF>
          <FF label="Phone *">    <Input value={form.phone} onChange={upd('phone')} placeholder="+91 XXXXX XXXXX" /></FF>
          <FF label="Email">      <Input value={form.email} onChange={upd('email')} type="email" placeholder="email@example.com" /></FF>
          <FF label="Status">
            <Sel value={form.patient_status} onChange={upd('patient_status')}>
              <option>Active</option><option>Inactive</option>
            </Sel>
          </FF>
        </div>
        <FF label="Condition / Diagnosis"><Input value={form.condition} onChange={upd('condition')} placeholder="e.g. PCOS, Thyroid Imbalance" /></FF>
        <FF label="Program">
          <Sel value={form.program} onChange={upd('program')}>
            <option value="">Select program…</option>
            <option>PCOS Healing</option>
            <option>{"Women's Obesity"}</option>
            <option>Metabolic Reset</option>
            <option>Diabetes Management</option>
            <option>Prenatal Wellness</option>
            <option>Postnatal Recovery</option>
          </Sel>
        </FF>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn variant="ghost"   T={T} onClick={() => { setShow(false); setEditPt(null) }}>Cancel</Btn>
          <Btn variant="primary" T={T} onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editPt ? 'Save Changes' : 'Add Patient'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
