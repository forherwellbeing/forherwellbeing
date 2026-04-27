import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/StatCard'
import { usePatients } from '../../hooks/usePatients'

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

const fmtDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
}

const getStatus = (patient) => {
  if (patient.payment_status) return patient.payment_status
  return Number(patient.amount_paid) > 0 ? 'Paid' : 'Pending'
}

const toBillingRows = (patients) => patients.map((patient) => {
  const paid = Number(patient.amount_paid) || 0
  const total = Number(patient.amount_total)
  const hasTotal = Number.isFinite(total) && total > 0

  return {
    id: patient.id,
    patient: patient.name || 'Unnamed Patient',
    program: patient.program || 'General Wellness',
    total,
    hasTotal,
    paid,
    balance: hasTotal ? Math.max(total - paid, 0) : null,
    date: patient.payment_date || patient.created_at,
    method: patient.payment_mode || '—',
    status: getStatus(patient),
  }
})

export default function StaffBilling({ T }) {
  const { patients, loading, error } = usePatients()
  const rows = toBillingRows(patients)

  const totalCollected = rows.reduce((sum, row) => sum + row.paid, 0)
  const pendingAmount = rows.reduce((sum, row) => sum + (row.balance || 0), 0)
  const pendingCount = rows.filter(row => row.status !== 'Paid').length
  const now = new Date()
  const thisMonthCollected = rows
    .filter((row) => {
      const d = new Date(row.date)
      return !Number.isNaN(d.getTime()) &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, row) => sum + row.paid, 0)

  if (error) {
    return <div style={{ color:'#D45B5B', padding:20 }}>Error loading billing data: {error}</div>
  }

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        <StatCard icon="₹" label="Total Collected" value={loading ? '…' : money(totalCollected)} change="All successful payments" color={T.success} />
        <StatCard icon="⌛" label="Pending Amount" value={loading ? '…' : pendingAmount > 0 ? money(pendingAmount) : '—'} change={loading ? 'Loading…' : `${pendingCount} pending record${pendingCount === 1 ? '' : 's'}`} color={T.warning} />
        <StatCard icon="📅" label="This Month" value={loading ? '…' : money(thisMonthCollected)} change="Current month collections" color={T.info} />
      </div>

      <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 14px rgba(0,0,0,0.05)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#FAFAFA', borderBottom:'1px solid #EDE8E5' }}>
              {['Patient','Program','Total','Paid','Balance','Date','Method','Status'].map(h => (
                <th key={h} style={{ padding:'11px 15px', textAlign:'left', fontSize:11.5, fontWeight:600, color:'#7A7A8A', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding:32, textAlign:'center', color:'#7A7A8A', fontSize:14 }}>Loading billing records…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={8} style={{ padding:32, textAlign:'center', color:'#7A7A8A', fontSize:14 }}>No payment records yet.</td></tr>
            ) : rows.map(row => (
              <tr key={row.id} style={{ borderBottom:'1px solid #EDE8E5' }}>
                <td style={{ padding:'12px 15px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <Avatar name={row.patient} size={29} />
                    <span style={{ fontWeight:500, fontSize:13 }}>{row.patient}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 15px', fontSize:12, color:'#7A7A8A', maxWidth:140 }}>{row.program}</td>
                <td style={{ padding:'12px 15px', fontSize:13.5, fontWeight:600 }}>{row.hasTotal ? money(row.total) : '—'}</td>
                <td style={{ padding:'12px 15px', fontSize:13.5, color:T.success, fontWeight:600 }}>{money(row.paid)}</td>
                <td style={{ padding:'12px 15px', fontSize:13.5, color:row.balance > 0 ? T.danger : '#7A7A8A' }}>{row.balance == null ? '—' : money(row.balance)}</td>
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
