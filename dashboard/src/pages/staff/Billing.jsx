import Avatar    from '../../components/ui/Avatar'
import Badge     from '../../components/ui/Badge'
import StatCard  from '../../components/StatCard'
import Icon      from '../../components/ui/Icon'
import Btn       from '../../components/ui/Button'
import { usePatients } from '../../hooks/usePatients'
import { useIsMobile } from '../../hooks/useIsMobile'

const exportCSV = rows => {
  const headers = 'Patient,Program,Amount Paid,Date,Method,Status'
  const body = rows.map(r =>
    [r.patient, r.program, r.paid, r.date, r.method, r.status].map(v => `"${String(v||'').replace(/"/g,'""')}"`).join(',')
  ).join('\n')
  const blob = new Blob([headers + '\n' + body], { type:'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'billing.csv'; a.click()
  URL.revokeObjectURL(url)
}

const money   = v => `₹${Number(v || 0).toLocaleString('en-IN')}`
const fmtDate = v => {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
}

const toRows = patients => patients.map(p => ({
  id:      p.id,
  patient: p.name || 'Unnamed Patient',
  program: p.program || 'General Wellness',
  paid:    Number(p.amount_paid) || 0,
  date:    p.payment_date || p.created_at,
  method:  p.payment_mode || 'Online / Razorpay',
  status:  p.payment_status || 'Paid',
}))

export default function StaffBilling({ T }) {
  const { patients, loading, error } = usePatients()
  const isMobile = useIsMobile()
  const rows = toRows(patients)

  const totalCollected     = rows.reduce((s, r) => s + r.paid, 0)
  const now                = new Date()
  const thisMonthCollected = rows
    .filter(r => { const d = new Date(r.date); return !Number.isNaN(d.getTime()) && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() })
    .reduce((s, r) => s + r.paid, 0)
  const totalPatients = rows.length

  if (error) return <div style={{ color:'#D45B5B', padding:20 }}>Error loading billing data: {error}</div>

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        <StatCard icon={<Icon name="trending" size={18} />} label="Total Collected"  value={loading ? '…' : money(totalCollected)}     change="All successful payments"    color={T.success} />
        <StatCard icon={<Icon name="calendar" size={18} />} label="This Month"       value={loading ? '…' : money(thisMonthCollected)}  change="Current month collections"  color={T.info}    />
        <StatCard icon={<Icon name="users"    size={18} />} label="Total Patients"   value={loading ? '…' : String(totalPatients)}      change="All time"                   color={T.accent}  />
      </div>

      {rows.length > 0 && (
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
          <Btn variant="ghost" T={T} onClick={() => exportCSV(rows)}>
            <Icon name="download" size={13} /> Export CSV
          </Btn>
        </div>
      )}

      <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 14px rgba(0,0,0,0.05)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:560 }}>
          <thead>
            <tr style={{ background:'#FAFAFA', borderBottom:'1px solid #EDE8E5' }}>
              {['Patient','Program','Amount Paid','Date','Method','Status'].map(h => (
                <th key={h} style={{ padding:'11px 15px', textAlign:'left', fontSize:11.5, fontWeight:600, color:'#7A7A8A', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding:32, textAlign:'center', color:'#7A7A8A', fontSize:14 }}>Loading billing records…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} style={{ padding:32, textAlign:'center', color:'#7A7A8A', fontSize:14 }}>No payment records yet.</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} style={{ borderBottom:'1px solid #EDE8E5' }}>
                <td style={{ padding:'12px 15px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <Avatar name={row.patient} size={29} />
                    <span style={{ fontWeight:500, fontSize:13 }}>{row.patient}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 15px', fontSize:12, color:'#7A7A8A', maxWidth:140 }}>{row.program}</td>
                <td style={{ padding:'12px 15px', fontSize:13.5, color:T.success, fontWeight:600 }}>{money(row.paid)}</td>
                <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{fmtDate(row.date)}</td>
                <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{row.method}</td>
                <td style={{ padding:'12px 15px' }}><Badge text={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
