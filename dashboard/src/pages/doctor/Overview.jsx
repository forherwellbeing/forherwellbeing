import StatCard  from '../../components/StatCard'
import Avatar    from '../../components/ui/Avatar'
import Badge     from '../../components/ui/Badge'
import LineChart from '../../components/charts/LineChart'
import Icon      from '../../components/ui/Icon'
import { CONSULTATIONS } from '../../data'

export default function DoctorOverview({ T }) {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        <StatCard icon={<Icon name="users"     size={18} />} label="Assigned Patients"     value="24" change="+3 this week"     color={T.accent}  />
        <StatCard icon={<Icon name="clipboard" size={18} />} label="Today's Consultations" value="6"  change="2 remaining"      color={T.info}    />
        <StatCard icon={<Icon name="alert"     size={18} />} label="Pending Follow-ups"    value="8"  change="3 need attention" color={T.warning} />
        <StatCard icon={<Icon name="file"      size={18} />} label="Reports This Month"    value="12" change="All reviewed"     color={T.success} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:14 }}>
        <div style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, marginBottom:16 }}>Today's Consultations</div>
          {CONSULTATIONS.map(c => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom:'1px solid #EDE8E5' }}>
              <Avatar name={c.patient} size={38} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{c.patient}</div>
                <div style={{ fontSize:12, color:'#7A7A8A' }}>{c.time} · {c.type}</div>
              </div>
              <Badge text={c.status} />
            </div>
          ))}
        </div>
        <div style={{ background:'#fff', borderRadius:16, padding:22, boxShadow:'0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, marginBottom:4 }}>Patient Growth</div>
          <div style={{ fontSize:12, color:'#7A7A8A', marginBottom:14 }}>New patients per month</div>
          <LineChart data={[{l:'Nov',v:8},{l:'Dec',v:11},{l:'Jan',v:14},{l:'Feb',v:18},{l:'Mar',v:20},{l:'Apr',v:24}]} width={276} height={134} color={T.accent} />
        </div>
      </div>
    </div>
  )
}
