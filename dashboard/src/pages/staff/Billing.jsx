import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/StatCard'
import { PAYMENTS } from '../../data'

export default function StaffBilling({ T }) {
  const total   = PAYMENTS.reduce((s, p) => s + p.paid, 0)
  const pending = PAYMENTS.reduce((s, p) => s + (p.amount - p.paid), 0)

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        <StatCard icon="₹"  label="Total Collected" value={`₹${(total/1000).toFixed(0)}K`}   change="April 2026"         color={T.success} />
        <StatCard icon="⏳" label="Pending Amount"   value={`₹${(pending/1000).toFixed(1)}K`} change="2 invoices pending" color={T.warning} />
        <StatCard icon="📅" label="This Month"       value="₹4.25L"                            change="+18% vs March"      color={T.info}    />
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
            {PAYMENTS.map(p => (
              <tr key={p.id} style={{ borderBottom:'1px solid #EDE8E5' }}>
                <td style={{ padding:'12px 15px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <Avatar name={p.patient} size={29} />
                    <span style={{ fontWeight:500, fontSize:13 }}>{p.patient}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 15px', fontSize:12, color:'#7A7A8A', maxWidth:140 }}>{p.program}</td>
                <td style={{ padding:'12px 15px', fontSize:13.5, fontWeight:600 }}>₹{p.amount.toLocaleString()}</td>
                <td style={{ padding:'12px 15px', fontSize:13.5, color:T.success, fontWeight:600 }}>₹{p.paid.toLocaleString()}</td>
                <td style={{ padding:'12px 15px', fontSize:13.5, color:p.amount-p.paid>0?T.danger:'#7A7A8A' }}>₹{(p.amount-p.paid).toLocaleString()}</td>
                <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.date}</td>
                <td style={{ padding:'12px 15px', fontSize:12.5, color:'#7A7A8A' }}>{p.method}</td>
                <td style={{ padding:'12px 15px' }}><Badge text={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
