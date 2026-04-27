import Badge from '../../components/ui/Badge'
import Btn from '../../components/ui/Button'
import { FF, Input, Textarea2 } from '../../components/ui/FormField'

export default function Profile({ role, T }) {
  const isDoc = role === 'doctor'
  return (
    <div style={{ maxWidth:620 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:26, boxShadow:'0 2px 14px rgba(0,0,0,0.05)' }}>
        <div style={{ display:'flex', gap:20, alignItems:'flex-start', marginBottom:22, paddingBottom:22, borderBottom:'1px solid #EDE8E5' }}>
          <div style={{ width:70, height:70, borderRadius:'50%', background:T.accentLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:T.accent, fontWeight:700, fontFamily:"'Playfair Display',serif" }}>
            {isDoc ? 'RD' : 'SA'}
          </div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700 }}>{isDoc ? 'Dr. Raga Deepthi' : 'Staff Admin'}</div>
            <div style={{ fontSize:13, color:'#7A7A8A', marginTop:4 }}>{isDoc ? 'PhD Metabolic Science · Yoga Certified' : 'Admin · For Her Wellbeing'}</div>
            <div style={{ marginTop:8 }}><Badge text="Active" /></div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <FF label="Full Name"><Input defaultValue={isDoc ? 'Dr. Raga Deepthi' : 'Staff Admin'} /></FF>
          <FF label="Email"><Input defaultValue={isDoc ? 'raga@forherwellbeing.com' : 'staff@forherwellbeing.com'} /></FF>
          <FF label="Phone"><Input defaultValue="+91 98765 00000" /></FF>
          <FF label={isDoc ? 'Specialisation' : 'Role'}><Input defaultValue={isDoc ? 'PhD Metabolic Science' : 'Admin'} /></FF>
        </div>

        {isDoc && (
          <FF label="Bio">
            <Textarea2 rows={3} defaultValue="PhD in Pediatric Metabolism from Heidelberg University, Germany. Certified Yoga instructor from Rishikesh & Svyasa University. 11 years of metabolic wellness expertise." />
          </FF>
        )}

        <div style={{ display:'flex', gap:10, marginTop:8 }}>
          <Btn variant="primary" T={T}>Save Changes</Btn>
          <Btn variant="ghost" T={T}>Change Password</Btn>
        </div>
      </div>
    </div>
  )
}
