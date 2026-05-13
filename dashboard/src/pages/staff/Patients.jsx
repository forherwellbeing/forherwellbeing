import { useState } from 'react'
import { usePatients } from '../../hooks/usePatients'
import Avatar  from '../../components/ui/Avatar'
import Badge   from '../../components/ui/Badge'
import Modal   from '../../components/ui/Modal'
import Btn     from '../../components/ui/Button'
import Icon    from '../../components/ui/Icon'
import { FF, Input, Sel } from '../../components/ui/FormField'
import SlotPicker          from '../../components/ui/SlotPicker'
import { useAppointments } from '../../hooks/useAppointments'
import { useIsMobile }    from '../../hooks/useIsMobile'
import IntakeModal        from '../../components/ui/IntakeModal'

const TODAY    = new Date().toISOString().split('T')[0]
const PROGRAMS =['All Programs','PCOS Healing',"Women's Obesity",'Metabolic Reset','Diabetes Management','Prenatal Wellness','Postnatal Recovery']
const STATUSES = ['All Status','Active','Inactive','Completed']
const BLANK    = { name:'', email:'', phone:'', condition:'', program:'', patient_status:'Active' }

const fmt = p => ({
  id:        p.id,
  name:      p.name,
  contact:   p.phone,
  email:     p.email,
  condition: p.condition || p.program || '—',
  program:   p.program   || '—',
  status:    p.patient_status || 'Active',
  lastVisit: p.payment_date
    ? new Date(p.payment_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    : new Date(p.created_at).toLocaleDateString('en-IN',  { day:'numeric', month:'short', year:'numeric' }),
  amountPaid: p.amount_paid,
})

const exportCSV = rows => {
  const headers = 'Name,Email,Phone,Condition,Program,Status,Paid On,Amount Paid'
  const body = rows.map(p =>
    [p.name, p.email||'', p.contact||'', p.condition, p.program, p.status, p.lastVisit, p.amountPaid||''].map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')
  ).join('\n')
  const blob = new Blob([headers + '\n' + body], { type:'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'patients.csv'; a.click()
  URL.revokeObjectURL(url)
}

function EmptyState() {
  return (
    <div style={{ textAlign:'center', padding:'52px 24px', color:'#7A7A8A' }}>
      <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#EDE8E5" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <div style={{ fontSize:15, fontWeight:600, color:'#1A1A2E', marginBottom:6 }}>No patients yet</div>
      <div style={{ fontSize:13 }}>Patients appear here automatically after completing a booking on the website.</div>
    </div>
  )
}

export default function StaffPatients({ T }) {
  const { patients, loading, error, addPatient, updatePatient, deletePatient } = usePatients()
  const isMobile = useIsMobile()
  const { appointments, addAppointment } = useAppointments()
  const [schedPt,  setSchedPt] = useState(null)
  const [schedForm, setSchedForm] = useState({ appointment_date: TODAY, appointment_time:'10:00', type:'Initial', meet_link:'', notes:'' })
  const [schedSaving, setSchedSaving] = useState(false)
  const [intakePt,  setIntakePt]  = useState(null)
  const [search,  setSearch]  = useState('')
  const [progFilter, setProg] = useState('All Programs')
  const [statFilter, setStat] = useState('All Status')
  const [showModal, setShow]  = useState(false)
  const [editPt,   setEditPt] = useState(null)
  const [form,     setForm]   = useState(BLANK)
  const [saving,   setSaving] = useState(false)

  const rows = patients.map(fmt)
  const filtered = rows.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.program?.toLowerCase().includes(q)
    const matchProg   = progFilter === 'All Programs' || p.program === progFilter
    const matchStat   = statFilter === 'All Status'   || p.status  === statFilter
    return matchSearch && matchProg && matchStat
  })

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    if (editPt) {
      await updatePatient(editPt.id, { name:form.name, email:form.email, phone:form.phone, condition:form.condition, program:form.program, patient_status:form.patient_status })
    } else {
      await addPatient({ name:form.name, email:form.email, phone:form.phone, condition:form.condition, program:form.program, patient_status:form.patient_status, payment_status:'Manual', amount_paid:0, payment_date:new Date().toISOString().split('T')[0], doctor:'Dr. Raga Deepthi' })
    }
    setSaving(false); setShow(false); setEditPt(null); setForm(BLANK)
  }

  const openEdit = row => {
    const raw = patients.find(p => p.id === row.id)
    setEditPt(raw)
    setForm({ name:raw.name, email:raw.email||'', phone:raw.phone||'', condition:raw.condition||'', program:raw.program||'', patient_status:raw.patient_status||'Active' })
    setShow(true)
  }

  const handleDelete = async id => { if (window.confirm('Delete this patient record?')) await deletePatient(id) }

  const handleSchedule = async () => {
    if (!schedPt || !schedForm.appointment_date) return
    setSchedSaving(true)
    const raw = patients.find(p => p.id === schedPt.id)
    await addAppointment({ patient_id: raw.id, patient_name: raw.name, patient_email: raw.email || '', patient_phone: raw.phone || '', program: raw.program || '', doctor:'Dr. Raga Deepthi', appointment_date: schedForm.appointment_date, appointment_time: schedForm.appointment_time, type: schedForm.type, meet_link: schedForm.meet_link, notes: schedForm.notes, status:'Scheduled' })
    setSchedSaving(false); setSchedPt(null); setSchedForm({ appointment_date: TODAY, appointment_time:'10:00', type:'Initial', meet_link:'', notes:'' })
  }

  if (error) return <div style={{ color:'#D45B5B', padding:20 }}>Error loading patients: {error}</div>

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients…"
            style={{ width:'100%', background:'#fff', border:'1.5px solid #EDE8E5', borderRadius:10, padding:'9px 14px 9px 36px', fontSize:13.5, outline:'none' }} />
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#7A7A8A' }}>⌕</span>
        </div>
        <select value={progFilter} onChange={e => setProg(e.target.value)}
          style={{ border:'1.5px solid #EDE8E5', borderRadius:10, padding:'9px 12px', fontSize:13, background:'#fff', color:'#1A1A2E', outline:'none', cursor:'pointer' }}>
          {PROGRAMS.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={statFilter} onChange={e => setStat(e.target.value)}
          style={{ border:'1.5px solid #EDE8E5', borderRadius:10, padding:'9px 12px', fontSize:13, background:'#fff', color:'#1A1A2E', outline:'none', cursor:'pointer' }}>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        {rows.length > 0 && (
          <Btn variant="ghost" T={T} onClick={() => exportCSV(filtered)}>
            <Icon name="download" size={13} /> Export CSV
          </Btn>
        )}
        <Btn variant="primary" T={T} onClick={() => { setEditPt(null); setForm(BLANK); setShow(true) }}>
          <Icon name="plus" size={13} /> Add Patient
        </Btn>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'#7A7A8A' }}>Loading patients…</div>
      ) : patients.length === 0 ? <EmptyState /> : (
        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 14px rgba(0,0,0,0.05)', overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:620 }}>
            <thead>
              <tr style={{ background:'#FAFAFA', borderBottom:'1px solid #EDE8E5' }}>
                {['Patient','Contact','Program','Paid On','Amount','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'11px 15px', textAlign:'left', fontSize:11.5, fontWeight:600, color:'#7A7A8A', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#7A7A8A', fontSize:14 }}>No patients match current filters.</td></tr>
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
                  <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.contact || '—'}</td>
                  <td style={{ padding:'12px 15px', fontSize:12.5 }}>{p.program}</td>
                  <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.lastVisit}</td>
                  <td style={{ padding:'12px 15px', fontSize:13, fontWeight:600, color:'#52A67A' }}>{p.amountPaid ? `₹${Number(p.amountPaid).toLocaleString()}` : '—'}</td>
                  <td style={{ padding:'12px 15px' }}><Badge text={p.status} /></td>
                  <td style={{ padding:'12px 15px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <Btn size="sm" variant="secondary" T={T} onClick={() => openEdit(p)}>Edit</Btn>
                      <Btn size="sm" variant="primary"   T={T} onClick={() => setSchedPt(p)}>Schedule</Btn>
                      <Btn size="sm" variant="ghost"     T={T} onClick={() => setIntakePt(patients.find(x => x.id === p.id))}>Intake</Btn>
                      <Btn size="sm" variant="danger"    T={T} onClick={() => handleDelete(p.id)}>Delete</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Schedule consultation modal */}
      <Modal open={!!schedPt} onClose={() => setSchedPt(null)} title={`Schedule — ${schedPt?.name || ''}`}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:12 }}>
          <FF label="Date *">
            <Input type="date" value={schedForm.appointment_date} onChange={e => setSchedForm(f => ({ ...f, appointment_date: e.target.value, appointment_time:'' }))} />
          </FF>
          <FF label="Type">
            <Sel value={schedForm.type} onChange={e => setSchedForm(f => ({ ...f, type: e.target.value }))}>
              <option>Initial</option><option>Follow-up</option><option>Emergency</option>
            </Sel>
          </FF>
        </div>
        <FF label="Select a Time Slot *">
          <SlotPicker
            T={T}
            selected={schedForm.appointment_time}
            onChange={v => setSchedForm(f => ({ ...f, appointment_time: v }))}
            bookedTimes={appointments
              .filter(a => a.appointment_date === schedForm.appointment_date && a.status !== 'Cancelled')
              .map(a => a.appointment_time)
            }
          />
        </FF>
        <FF label="Meet Link"><Input value={schedForm.meet_link} onChange={e => setSchedForm(f => ({ ...f, meet_link: e.target.value }))} placeholder="https://meet.google.com/…" /></FF>
        <FF label="Notes"><Input value={schedForm.notes} onChange={e => setSchedForm(f => ({ ...f, notes: e.target.value }))} placeholder="Preparation instructions…" /></FF>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn variant="ghost"   T={T} onClick={() => setSchedPt(null)}>Cancel</Btn>
          <Btn variant="primary" T={T} onClick={handleSchedule} disabled={schedSaving || !schedForm.appointment_date || !schedForm.appointment_time}>{schedSaving ? 'Scheduling…' : 'Confirm Appointment'}</Btn>
        </div>
      </Modal>

      <IntakeModal
        patient={intakePt}
        open={!!intakePt}
        onClose={() => setIntakePt(null)}
        onSave={async (id, data) => { await updatePatient(id, data); setIntakePt(null) }}
        T={T}
      />

      <Modal open={showModal} onClose={() => { setShow(false); setEditPt(null) }} title={editPt ? 'Edit Patient' : 'Add Patient Manually'}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:12 }}>
          <FF label="Full Name *"><Input value={form.name}  onChange={upd('name')}  placeholder="Full name" /></FF>
          <FF label="Phone *">    <Input value={form.phone} onChange={upd('phone')} placeholder="+91 XXXXX XXXXX" /></FF>
          <FF label="Email">      <Input value={form.email} onChange={upd('email')} type="email" placeholder="email@example.com" /></FF>
          <FF label="Status">
            <Sel value={form.patient_status} onChange={upd('patient_status')}>
              <option>Active</option><option>Inactive</option><option>Completed</option>
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
