import StatCard    from '../../components/StatCard'
import Avatar      from '../../components/ui/Avatar'
import Badge       from '../../components/ui/Badge'
import BarChart    from '../../components/charts/BarChart'
import Icon        from '../../components/ui/Icon'
import { usePatients } from '../../hooks/usePatients'

export default function DoctorOverview({ T }) {
  const { patients, loading } = usePatients()

  const now   = new Date()
  const total = patients.length

  const pendingConsults = patients.filter(p =>
    (p.consultation_status || 'Pending') === 'Pending'
  ).length

  const thisMonthRevenue = patients
    .filter(p => {
      const d = new Date(p.payment_date || p.created_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((s, p) => s + (Number(p.amount_paid) || 0), 0)

  const monthlyPatients = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const label = d.toLocaleString('en-IN', { month:'short' })
    const month = d.getMonth()
    const year  = d.getFullYear()
    const monthPts = patients.filter(p => {
      const pd = new Date(p.payment_date || p.created_at)
      return pd.getMonth() === month && pd.getFullYear() === year
    })
    return { l: label, v: monthPts.length, count: monthPts.length, revenue: monthPts.reduce((s, p) => s + (Number(p.amount_paid) || 0), 0) }
  })

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6)

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        <StatCard icon={<Icon name="users"     size={18} />} label="Total Patients"      value={loading ? '…' : String(total)}                                            change="All time"            color={T.accent}  />
        <StatCard icon={<Icon name="clipboard" size={18} />} label="Pending Consultations" value={loading ? '…' : String(pendingConsults)}                                change="Awaiting session"    color={T.info}    />
        <StatCard icon={<Icon name="trending"  size={18} />} label="Revenue This Month"  value={loading ? '…' : `₹${(thisMonthRevenue/1000).toFixed(1)}K`}               change="Current month"       color={T.success} />
        <StatCard icon={<Icon name="activity"  size={18} />} label="New This Month"      value={loading ? '…' : String(monthlyPatients[5]?.count ?? 0)}                   change="Bookings this month" color={T.warning} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:14 }}>
        <div style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, marginBottom:4 }}>Patient Growth</div>
          <div style={{ fontSize:12, color:'#7A7A8A', marginBottom:14 }}>New patients per month — hover for details</div>
          {loading
            ? <div style={{ height:150, display:'flex', alignItems:'center', justifyContent:'center', color:'#7A7A8A' }}>Loading…</div>
            : <BarChart data={monthlyPatients} width={440} height={150} color={T.accent} />
          }
        </div>

        <div style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, marginBottom:16 }}>Recent Patients</div>
          {loading ? (
            <div style={{ color:'#7A7A8A', fontSize:13 }}>Loading…</div>
          ) : recentPatients.length === 0 ? (
            <div style={{ color:'#7A7A8A', fontSize:13 }}>No patients yet.</div>
          ) : recentPatients.map(p => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid #EDE8E5' }}>
              <Avatar name={p.name} size={34} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, fontSize:13.5 }}>{p.name}</div>
                <div style={{ fontSize:11.5, color:'#7A7A8A' }}>{p.program || 'Initial Consultation'}</div>
              </div>
              <Badge text={p.patient_status || 'Active'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
