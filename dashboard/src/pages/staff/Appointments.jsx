import { useState } from 'react'
import Avatar  from '../../components/ui/Avatar'
import Badge   from '../../components/ui/Badge'
import Modal   from '../../components/ui/Modal'
import Btn     from '../../components/ui/Button'
import Icon    from '../../components/ui/Icon'
import { FF, Input, Sel, Textarea2 } from '../../components/ui/FormField'
import SlotPicker          from '../../components/ui/SlotPicker'
import { useAppointments } from '../../hooks/useAppointments'
import { usePatients }     from '../../hooks/usePatients'

const TODAY     = new Date().toISOString().split('T')[0]
const BLANK     = { patient_id:'', patient_name:'', patient_email:'', patient_phone:'', program:'', doctor:'Dr. Raga Deepthi', appointment_date:TODAY, appointment_time:'10:00', type:'Initial', notes:'', meet_link:'' }
const FILTERS   = ['All','Today','Upcoming','Completed','Cancelled']
const STATUS_OPTIONS = ['Scheduled','Confirmed','Completed','Cancelled']

const fmtDate = iso => {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
}

const fmtTime = t => {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${period}`
}

function EmptyState({ filter }) {
  return (
    <div style={{ textAlign:'center', padding:'52px 24px', color:'#7A7A8A' }}>
      <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="#EDE8E5" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:14 }}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <div style={{ fontSize:15, fontWeight:600, color:'#1A1A2E', marginBottom:6 }}>No appointments {filter !== 'All' ? `for "${filter}"` : 'yet'}</div>
      <div style={{ fontSize:13 }}>Use the Schedule button to book a consultation for a patient.</div>
    </div>
  )
}

export default function StaffAppointments({ T }) {
  const { appointments, loading, error, addAppointment, updateAppointment, deleteAppointment } = useAppointments()
  const { patients } = usePatients()

  const [filter,    setFilter]  = useState('All')
  const [showModal, setShow]    = useState(false)
  const [editAppt,  setEdit]    = useState(null)
  const [form,      setForm]    = useState(BLANK)
  const [saving,    setSaving]  = useState(false)
  const [copied,    setCopied]  = useState(null)

  const filtered = appointments.filter(a => {
    if (filter === 'Today')     return a.appointment_date === TODAY
    if (filter === 'Upcoming')  return a.appointment_date > TODAY && a.status !== 'Cancelled' && a.status !== 'Completed'
    if (filter === 'Completed') return a.status === 'Completed'
    if (filter === 'Cancelled') return a.status === 'Cancelled'
    return true
  })

  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const onPatientSelect = e => {
    const p = patients.find(p => p.id === e.target.value)
    setForm(f => ({ ...f, patient_id: p?.id || '', patient_name: p?.name || '', patient_email: p?.email || '', patient_phone: p?.phone || '', program: p?.program || '' }))
  }

  const openNew = (prefill = null) => {
    setEdit(null)
    setForm(prefill ? { ...BLANK, ...prefill } : BLANK)
    setShow(true)
  }

  const openEdit = appt => {
    setEdit(appt)
    setForm({ patient_id: appt.patient_id || '', patient_name: appt.patient_name, patient_email: appt.patient_email || '', patient_phone: appt.patient_phone || '', program: appt.program || '', doctor: appt.doctor || 'Dr. Raga Deepthi', appointment_date: appt.appointment_date, appointment_time: appt.appointment_time, type: appt.type || 'Initial', notes: appt.notes || '', meet_link: appt.meet_link || '' })
    setShow(true)
  }

  const handleSave = async () => {
    if (!form.patient_name || !form.appointment_date || !form.appointment_time) return
    setSaving(true)
    const payload = { patient_id: form.patient_id || null, patient_name: form.patient_name, patient_email: form.patient_email, patient_phone: form.patient_phone, program: form.program, doctor: form.doctor, appointment_date: form.appointment_date, appointment_time: form.appointment_time, type: form.type, notes: form.notes, meet_link: form.meet_link, status: editAppt ? undefined : 'Scheduled' }
    if (editAppt) {
      delete payload.status
      await updateAppointment(editAppt.id, payload)
    } else {
      payload.status = 'Scheduled'
      await addAppointment(payload)
    }
    setSaving(false); setShow(false); setEdit(null); setForm(BLANK)
  }

  const changeStatus = async (id, status) => { await updateAppointment(id, { status }) }

  const copyLink = (id, link) => {
    navigator.clipboard.writeText(link).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000) })
  }

  if (error) return <div style={{ color:'#D45B5B', padding:20 }}>Error: {error}</div>

  return (
    <div>
      {/* Filter bar + Schedule button */}
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {FILTERS.map(f => {
            const count = f === 'All' ? appointments.length : appointments.filter(a => {
              if (f === 'Today')     return a.appointment_date === TODAY
              if (f === 'Upcoming')  return a.appointment_date > TODAY && a.status !== 'Cancelled' && a.status !== 'Completed'
              if (f === 'Completed') return a.status === 'Completed'
              if (f === 'Cancelled') return a.status === 'Cancelled'
              return false
            }).length
            return (
              <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 16px', borderRadius:20, border:`1.5px solid ${filter===f?T.accent:'#EDE8E5'}`, background:filter===f?T.accentLight:'white', color:filter===f?T.accent:'#7A7A8A', fontSize:13, cursor:'pointer', fontFamily:'inherit', fontWeight:filter===f?600:400 }}>
                {f} {count > 0 && <span style={{ fontSize:11, background:filter===f?T.accent+'30':'#F0EDF8', borderRadius:10, padding:'1px 6px', marginLeft:4 }}>{count}</span>}
              </button>
            )
          })}
        </div>
        <Btn variant="primary" T={T} onClick={() => openNew()}>
          <Icon name="plus" size={13} /> Schedule Appointment
        </Btn>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'#7A7A8A' }}>Loading appointments…</div>
      ) : filtered.length === 0 ? <EmptyState filter={filter} /> : (
        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 14px rgba(0,0,0,0.05)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#FAFAFA', borderBottom:'1px solid #EDE8E5' }}>
                {['Patient','Date','Time','Type','Meet Link','Status',''].map(h => (
                  <th key={h} style={{ padding:'11px 15px', textAlign:'left', fontSize:11.5, fontWeight:600, color:'#7A7A8A', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom:'1px solid #EDE8E5' }}>
                  <td style={{ padding:'12px 15px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar name={a.patient_name} size={31} />
                      <div>
                        <div style={{ fontWeight:500, fontSize:13.5 }}>{a.patient_name}</div>
                        {a.program && <div style={{ fontSize:11.5, color:'#7A7A8A' }}>{a.program}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 15px', fontSize:13.5, fontWeight:500 }}>{fmtDate(a.appointment_date)}</td>
                  <td style={{ padding:'12px 15px', fontSize:13.5, fontWeight:500 }}>{fmtTime(a.appointment_time)}</td>
                  <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{a.type}</td>
                  <td style={{ padding:'12px 15px' }}>
                    {a.meet_link ? (
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <a href={a.meet_link} target="_blank" rel="noreferrer" style={{ fontSize:12, color:T.accent, textDecoration:'none', fontWeight:500 }}>Open Link</a>
                        <button onClick={() => copyLink(a.id, a.meet_link)} style={{ fontSize:11, color:'#7A7A8A', background:'#FAF8F5', border:'1px solid #EDE8E5', borderRadius:5, padding:'2px 7px', cursor:'pointer', fontFamily:'inherit' }}>
                          {copied === a.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize:12, color:'#C0BAB4' }}>Not added</span>
                    )}
                  </td>
                  <td style={{ padding:'12px 15px' }}>
                    <select value={a.status} onChange={e => changeStatus(a.id, e.target.value)}
                      style={{ border:'1.5px solid #EDE8E5', borderRadius:8, padding:'4px 8px', fontSize:12.5, background:'#FAFAFA', cursor:'pointer', fontFamily:'inherit', outline:'none', color:'#1A1A2E' }}>
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:'12px 15px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <Btn size="sm" variant="secondary" T={T} onClick={() => openEdit(a)}>Edit</Btn>
                      <Btn size="sm" variant="danger"    T={T} onClick={() => deleteAppointment(a.id)}>Cancel</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Schedule / Edit Modal */}
      <Modal open={showModal} onClose={() => { setShow(false); setEdit(null) }} title={editAppt ? 'Edit Appointment' : 'Schedule Appointment'}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FF label="Patient *" style={{ gridColumn:'1/-1' }}>
            {editAppt ? (
              <input value={form.patient_name} disabled style={{ width:'100%', border:'1.5px solid #EDE8E5', borderRadius:9, padding:'9px 12px', fontSize:13.5, background:'#F5F5F5', color:'#7A7A8A', outline:'none' }} />
            ) : (
              <select value={form.patient_id} onChange={onPatientSelect}
                style={{ width:'100%', border:'1.5px solid #EDE8E5', borderRadius:9, padding:'9px 12px', fontSize:13.5, background:'#FAFAFA', color:'#1A1A2E', outline:'none', cursor:'pointer' }}>
                <option value="">Select patient or type below…</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}{p.program ? ` — ${p.program}` : ''}</option>)}
              </select>
            )}
          </FF>
          {!editAppt && !form.patient_id && (
            <FF label="Or enter name manually">
              <Input value={form.patient_name} onChange={upd('patient_name')} placeholder="Full name" />
            </FF>
          )}
          <FF label="Date *">
            <Input type="date" value={form.appointment_date} onChange={e => { upd('appointment_date')(e); upd('appointment_time')({ target:{ value:'' } }) }} />
          </FF>
          <FF label="Type">
            <Sel value={form.type} onChange={upd('type')}>
              <option>Initial</option><option>Follow-up</option><option>Emergency</option>
            </Sel>
          </FF>
        </div>
        <FF label="Select a Time Slot *">
          <SlotPicker
            T={T}
            selected={form.appointment_time}
            onChange={v => upd('appointment_time')({ target:{ value:v } })}
            bookedTimes={appointments
              .filter(a => a.appointment_date === form.appointment_date && a.status !== 'Cancelled' && (!editAppt || a.id !== editAppt.id))
              .map(a => a.appointment_time)
            }
          />
        </FF>
        <FF label="Google Meet / Video Link">
          <Input value={form.meet_link} onChange={upd('meet_link')} placeholder="https://meet.google.com/xxx-xxxx-xxx" />
        </FF>
        <FF label="Notes">
          <Textarea2 rows={3} value={form.notes} onChange={upd('notes')} placeholder="Any preparation instructions or special notes…" />
        </FF>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Btn variant="ghost"   T={T} onClick={() => { setShow(false); setEdit(null) }}>Cancel</Btn>
          <Btn variant="primary" T={T} onClick={handleSave} disabled={saving || !form.patient_name || !form.appointment_date}>
            {saving ? 'Saving…' : editAppt ? 'Save Changes' : 'Schedule Appointment'}
          </Btn>
        </div>
      </Modal>
    </div>
  )
}
