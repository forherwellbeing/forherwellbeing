import { useState } from 'react'
import { usePatients } from '../../hooks/usePatients'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Btn from '../../components/ui/Button'

const fmt = (p) => ({
  id:        p.id,
  name:      p.name,
  email:     p.email,
  contact:   p.phone,
  condition: p.condition || p.program || '—',
  program:   p.program   || '—',
  status:    p.patient_status || 'Active',
  lastVisit: p.payment_date
    ? new Date(p.payment_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    : new Date(p.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
  notes: p.consult_notes,
})

export default function DoctorPatients({ T }) {
  const { patients, loading, error } = usePatients()
  const [search, setSearch] = useState('')
  const [sel, setSel]       = useState(null)

  const rows     = patients.map(fmt)
  const filtered = rows.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  )

  if (error) return <div style={{ color:'#D45B5B', padding:20 }}>Error: {error}</div>

  return (
    <div>
      <div style={{ position:'relative', marginBottom:16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or condition…" style={{ width:'100%', background:'#fff', border:'1.5px solid #EDE8E5', borderRadius:10, padding:'10px 14px 10px 36px', fontSize:13.5, outline:'none' }} />
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#7A7A8A' }}>⌕</span>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'#7A7A8A' }}>Loading patients…</div>
      ) : (
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
                <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#7A7A8A', fontSize:14 }}>No patients found.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom:'1px solid #EDE8E5' }}>
                  <td style={{ padding:'13px 15px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar name={p.name} size={32} />
                      <div>
                        <div style={{ fontWeight:500, fontSize:14 }}>{p.name}</div>
                        {p.email && <div style={{ fontSize:11.5, color:'#7A7A8A' }}>{p.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'13px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.contact}</td>
                  <td style={{ padding:'13px 15px', fontSize:13 }}>{p.condition}</td>
                  <td style={{ padding:'13px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.program}</td>
                  <td style={{ padding:'13px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.lastVisit}</td>
                  <td style={{ padding:'13px 15px' }}><Badge text={p.status} /></td>
                  <td style={{ padding:'13px 15px' }}><Btn size="sm" variant="secondary" T={T} onClick={() => setSel(p)}>View</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
            {[['Email',sel.email||'—'],['Contact',sel.contact||'—'],['Program',sel.program],['Paid On',sel.lastVisit]].map(([k, v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #EDE8E5' }}>
                <span style={{ fontSize:13, color:'#7A7A8A' }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:500 }}>{v}</span>
              </div>
            ))}
            {sel.notes && (
              <div style={{ marginTop:18, padding:14, background:T.accentLight, borderRadius:10 }}>
                <div style={{ fontSize:11.5, fontWeight:600, color:T.accent, marginBottom:6 }}>Notes from Booking</div>
                <div style={{ fontSize:13, lineHeight:1.6 }}>{sel.notes}</div>
              </div>
            )}
            <div style={{ marginTop:16, display:'flex', gap:10 }}>
              <Btn variant="primary" T={T}>Add Consultation Note</Btn>
              <Btn variant="ghost"   T={T}>View Full History</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
