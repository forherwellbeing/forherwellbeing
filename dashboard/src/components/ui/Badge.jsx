const COLORS = {
  Active:    { bg:'#E8F5EE', c:'#1E6B40' },
  Inactive:  { bg:'#F5E8E8', c:'#7A2D2D' },
  Completed: { bg:'#E8F5EE', c:'#1E6B40' },
  Scheduled: { bg:'#EBF0FB', c:'#2A4FA0' },
  Confirmed: { bg:'#E8F5EE', c:'#1E6B40' },
  Pending:   { bg:'#FFF3E8', c:'#7A5A2D' },
  Paid:      { bg:'#E8F5EE', c:'#1E6B40' },
  Partial:   { bg:'#FFF3E8', c:'#7A5A2D' },
}

export default function Badge({ text }) {
  const s = COLORS[text] || { bg:'#F0EDF8', c:'#5A4A7A' }
  return (
    <span style={{ background:s.bg, color:s.c, padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, whiteSpace:'nowrap' }}>
      {text}
    </span>
  )
}
