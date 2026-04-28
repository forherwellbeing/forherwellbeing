import { useState } from 'react'
import { usePatients } from '../../hooks/usePatients'
import Avatar  from '../../components/ui/Avatar'
import Badge   from '../../components/ui/Badge'
import Modal   from '../../components/ui/Modal'
import Btn     from '../../components/ui/Button'
import Icon    from '../../components/ui/Icon'
import { FF, Textarea2 } from '../../components/ui/FormField'

const PROGRAMS = ['All Programs','PCOS Healing',"Women's Obesity",'Metabolic Reset','Diabetes Management','Prenatal Wellness','Postnatal Recovery']
const STATUSES = ['All Status','Active','Inactive','Completed']

const fmt = p => ({
  id:        p.id,
  name:      p.name,
  email:     p.email,
  contact:   p.phone,
  condition: p.condition || p.program || '—',
  program:   p.program   || '—',
  status:    p.patient_status || 'Active',
  lastVisit: p.payment_date
    ? new Date(p.payment_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    : new Date(p.created_at).toLocaleDateString('en-IN',  { day:'numeric', month:'short', year:'numeric' }),
  notes:     p.consult_notes || '',
  amountPaid: p.amount_paid,
})

const exportCSV = (rows) => {
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
      <div style={{ fontSize:13 }}>Patients will appear here as soon as they complete a booking on the website.</div>
    </div>
  )
}

export default function DoctorPatients({ T }) {
  const { patients, loading, error, updatePatient } = usePatients()
  const [search,  setSearch]  = useState('')
  const [progFilter, setProg] = useState('All Programs')
  const [statFilter, setStat] = useState('All Status')
  const [sel,     setSel]     = useState(null)
  const [notes,   setNotes]   = useState('')
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  const rows = patients.map(fmt)
  const filtered = rows.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)
    const matchProg   = progFilter === 'All Programs' || p.program === progFilter
    const matchStat   = statFilter === 'All Status'   || p.status  === statFilter
    return matchSearch && matchProg && matchStat
  })

  const openPatient = p => { setSel(p); setNotes(p.notes || ''); setSaved(false) }

  const saveNotes = async () => {
    if (!sel) return
    setSaving(true)
    await updatePatient(sel.id, { consult_notes: notes })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const changeStatus = async (id, status) => {
    await updatePatient(id, { patient_status: status })
  }

  if (error) return <div style={{ color:'#D45B5B', padding:20 }}>Error: {error}</div>

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, condition or email…"
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
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'#7A7A8A' }}>Loading patients…</div>
      ) : patients.length === 0 ? <EmptyState /> : (
        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 14px rgba(0,0,0,0.05)', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#FAFAFA', borderBottom:'1px solid #EDE8E5' }}>
                {['Patient','Contact','Condition','Program','Paid On','Status',''].map(h => (
                  <th key={h} style={{ padding:'11px 15px', textAlign:'left', fontSize:11.5, fontWeight:600, color:'#7A7A8A', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#7A7A8A', fontSize:14 }}>No patients match the current filters.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom:'1px solid #EDE8E5' }}>
                  <td style={{ padding:'12px 15px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar name={p.name} size={32} />
                      <div>
                        <div style={{ fontWeight:500, fontSize:14 }}>{p.name}</div>
                        {p.email && <div style={{ fontSize:11.5, color:'#7A7A8A' }}>{p.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.contact || '—'}</td>
                  <td style={{ padding:'12px 15px', fontSize:13 }}>{p.condition}</td>
                  <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.program}</td>
                  <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.lastVisit}</td>
                  <td style={{ padding:'12px 15px' }}>
                    <select value={p.status} onChange={e => changeStatus(p.id, e.target.value)}
                      style={{ border:'none', background:'transparent', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', color: p.status === 'Active' ? '#52A67A' : p.status === 'Completed' ? '#5B8DD9' : '#7A7A8A', fontWeight:600, outline:'none' }}>
                      <option>Active</option><option>Inactive</option><option>Completed</option>
                    </select>
                  </td>
                  <td style={{ padding:'12px 15px' }}>
                    <Btn size="sm" variant="secondary" T={T} onClick={() => openPatient(p)}>View</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Patient detail + notes modal */}
      <Modal open={!!sel} onClose={() => setSel(null)} title="Patient Details">
        {sel && (
          <div>
            <div style={{ display:'flex', gap:16, alignItems:'center', background:'#FAF8F5', borderRadius:12, padding:16, marginBottom:18 }}>
              <Avatar name={sel.name} size={52} />
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700 }}>{sel.name}</div>
                <div style={{ fontSize:13, color:'#7A7A8A', marginTop:2 }}>{sel.condition}</div>
                <div style={{ marginTop:7 }}><Badge text={sel.status} /></div>
              </div>
            </div>
            {[['Email',sel.email||'—'],['Phone',sel.contact||'—'],['Program',sel.program],['Amount Paid', sel.amountPaid ? `₹${Number(sel.amountPaid).toLocaleString('en-IN')}` : '—'],['Paid On',sel.lastVisit]].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #EDE8E5' }}>
                <span style={{ fontSize:13, color:'#7A7A8A' }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:500 }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:18 }}>
              <FF label="Consultation Notes">
                <Textarea2 value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes from this consultation — diagnosis, diet plan, follow-up instructions…" rows={5} />
              </FF>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:14, justifyContent:'flex-end' }}>
              <Btn variant="ghost" T={T} onClick={() => setSel(null)}>Close</Btn>
              <Btn variant="primary" T={T} onClick={saveNotes} disabled={saving}>
                {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Notes'}
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
