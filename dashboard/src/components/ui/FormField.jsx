export const inp = (extra = {}) => ({
  width:'100%', border:'1.5px solid #EDE8E5', borderRadius:9,
  padding:'9px 12px', fontSize:13.5, color:'#1A1A2E',
  background:'#FAFAFA', outline:'none', ...extra,
})

export function FF({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:'block', fontSize:12.5, fontWeight:500, color:'#1A1A2E', marginBottom:5 }}>{label}</label>
      {children}
    </div>
  )
}

export function Input(props) {
  return <input {...props} style={inp(props.style)} />
}

export function Sel({ children, ...props }) {
  return <select {...props} style={inp({ cursor:'pointer', ...props.style })}>{children}</select>
}

export function Textarea2(props) {
  return <textarea {...props} style={inp({ resize:'vertical', minHeight:76, ...props.style })} />
}
