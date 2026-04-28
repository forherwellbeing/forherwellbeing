import StatCard  from '../../components/StatCard'
import BarChart  from '../../components/charts/BarChart'
import DonutChart from '../../components/charts/DonutChart'
import Icon      from '../../components/ui/Icon'
import { usePatients } from '../../hooks/usePatients'

const PROGRAM_COLORS = {
  'PCOS Healing':        '#B05A72',
  "Women's Obesity":     '#52A67A',
  'Metabolic Reset':     '#5B8DD9',
  'Diabetes Management': '#D4854A',
  'Prenatal Wellness':   '#7B6DD9',
  'Postnatal Recovery':  '#C17B3A',
}

export default function StaffOverview({ T }) {
  const { patients, loading } = usePatients()

  const total   = patients.length
  const revenue = patients.reduce((s, p) => s + (Number(p.amount_paid) || 0), 0)

  const programCounts = patients.reduce((acc, p) => {
    const prog = p.program || 'Other'
    acc[prog] = (acc[prog] || 0) + 1
    return acc
  }, {})

  const donutSegs = Object.entries(programCounts)
    .map(([name, v]) => ({ name, v, color: PROGRAM_COLORS[name] || T.accent }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 5)

  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const label = d.toLocaleString('en-IN', { month: 'short' })
    const month = d.getMonth()
    const year  = d.getFullYear()
    const monthPatients = patients.filter(p => {
      const pd = new Date(p.payment_date || p.created_at)
      return pd.getMonth() === month && pd.getFullYear() === year
    })
    const v = monthPatients.reduce((s, p) => s + (Number(p.amount_paid) || 0), 0)
    return { l: label, v: v || 0, count: monthPatients.length }
  })

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        <StatCard icon={<Icon name="users"    size={18} />} label="Total Patients"       value={loading ? '…' : String(total)}                                     change="All time"         color={T.accent}  />
        <StatCard icon={<Icon name="calendar" size={18} />} label="Today's Appointments" value="—"                                                                  change="Connect calendar" color={T.info}    />
        <StatCard icon={<Icon name="trending" size={18} />} label="Total Revenue"        value={loading ? '…' : `₹${(revenue / 1000).toFixed(1)}K`}                change="All payments"     color={T.success} />
        <StatCard icon={<Icon name="activity" size={18} />} label="Active Programs"      value={loading ? '…' : String(Object.keys(programCounts).length || 0)}    change="Running now"      color={T.warning} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 316px', gap:14 }}>
        <div style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, marginBottom:4 }}>Monthly Revenue</div>
          <div style={{ fontSize:12, color:'#7A7A8A', marginBottom:14 }}>Last 6 months — hover a bar for details</div>
          {loading
            ? <div style={{ height:150, display:'flex', alignItems:'center', justifyContent:'center', color:'#7A7A8A' }}>Loading…</div>
            : <BarChart data={monthlyRevenue} width={440} height={150} color={T.accent} />
          }
        </div>

        <div style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, marginBottom:4 }}>Program Enrollment</div>
          <div style={{ fontSize:12, color:'#7A7A8A', marginBottom:14 }}>Patients by program</div>
          {loading ? (
            <div style={{ height:106, display:'flex', alignItems:'center', justifyContent:'center', color:'#7A7A8A' }}>Loading…</div>
          ) : donutSegs.length === 0 ? (
            <div style={{ textAlign:'center', color:'#7A7A8A', fontSize:13, padding:20 }}>No data yet</div>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <DonutChart segs={donutSegs} size={106} />
              <div>
                {donutSegs.map(({ name, v, color }) => (
                  <div key={name} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:color, flexShrink:0 }} />
                    <div style={{ fontSize:12, color:'#7A7A8A', flex:1 }}>{name}</div>
                    <div style={{ fontSize:12, fontWeight:600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
