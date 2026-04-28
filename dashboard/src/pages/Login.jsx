import { useState } from 'react'
import { mkT, TWEAK_DEFAULTS } from '../theme'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const T = mkT(TWEAK_DEFAULTS)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }
    const userRole = data.user.user_metadata?.role || 'doctor'
    onLogin(userRole)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#FAF8F5' }}>
      {/* Left panel */}
      <div style={{ width:'42%', background:T.sidebar, padding:'44px 42px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-70, right:-70, width:220, height:220, borderRadius:'50%', border:`1px solid ${T.accent}28` }}/>
        <div style={{ position:'absolute', top:-30, right:-30, width:130, height:130, borderRadius:'50%', border:`1px solid ${T.accent}18` }}/>
        <div style={{ position:'absolute', bottom:70, left:-50, width:170, height:170, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'#FAF8F5', lineHeight:1.2 }}>
            For Her<br/><span style={{ fontStyle:'italic', color:T.accent }}>Wellbeing</span>
          </div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:8 }}>Healthcare Management Portal</div>
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:600, color:'#FAF8F5', lineHeight:1.5, marginBottom:20 }}>
            Science-backed<br/><span style={{ color:T.accent, fontStyle:'italic' }}>holistic wellness</span><br/>for women.
          </div>
          {['Manage patient consultations & progress','Track billing & program enrollments','Generate detailed health reports'].map((t, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,0.55)', marginBottom:10 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:T.accent, flexShrink:0 }}/>
              {t}
            </div>
          ))}
        </div>
        <div style={{ position:'relative', zIndex:1, fontSize:12, color:'rgba(255,255,255,0.28)' }}>Dr. Raga Deepthi · PhD Metabolic Science</div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:44 }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <div style={{ marginBottom:34 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:27, fontWeight:700, color:'#1A1A2E', marginBottom:5 }}>Welcome back</div>
            <div style={{ fontSize:14, color:'#7A7A8A' }}>Sign in to access your dashboard</div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#1A1A2E', marginBottom:5 }}>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address" style={{ width:'100%', border:'1.5px solid #EDE8E5', borderRadius:10, padding:'11px 13px', fontSize:14, background:'#FAFAFA', color:'#1A1A2E', outline:'none' }} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#1A1A2E', marginBottom:5 }}>Password</label>
            <input value={password} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••••" style={{ width:'100%', border:'1.5px solid #EDE8E5', borderRadius:10, padding:'11px 13px', fontSize:14, background:'#FAFAFA', color:'#1A1A2E', outline:'none' }} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          {error && <div style={{ color:'#D45B5B', fontSize:13, marginBottom:10, padding:'8px 12px', background:'#FEF2F2', borderRadius:8 }}>{error}</div>}

          <button onClick={handleLogin} disabled={loading} style={{ width:'100%', background:loading?'#7A7A8A':T.accent, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:loading?'not-allowed':'pointer', fontFamily:'inherit', marginTop:14, transition:'all 0.2s' }}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>

        </div>
      </div>
    </div>
  )
}
