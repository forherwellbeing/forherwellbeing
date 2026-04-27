export const PATIENTS = [
  { id:1, name:'Priya Sharma',     age:28, contact:'+91 98765 43210', condition:'PCOS',              doctor:'Dr. Raga Deepthi', status:'Active',   lastVisit:'20 Apr 2026', program:'PCOS Healing' },
  { id:2, name:'Ananya Reddy',     age:34, contact:'+91 87654 32109', condition:'Thyroid Imbalance', doctor:'Dr. Raga Deepthi', status:'Active',   lastVisit:'22 Apr 2026', program:'Metabolic Reset' },
  { id:3, name:'Meena Krishnan',   age:31, contact:'+91 76543 21098', condition:'Obesity',           doctor:'Dr. Raga Deepthi', status:'Active',   lastVisit:'18 Apr 2026', program:"Women's Obesity" },
  { id:4, name:'Sunita Patel',     age:26, contact:'+91 65432 10987', condition:'Insulin Resistance',doctor:'Dr. Raga Deepthi', status:'Inactive', lastVisit:'10 Apr 2026', program:'Diabetes Mgmt' },
  { id:5, name:'Kavitha Nair',     age:29, contact:'+91 54321 09876', condition:'Hormonal Imbalance',doctor:'Dr. Raga Deepthi', status:'Active',   lastVisit:'25 Apr 2026', program:'PCOS Healing' },
  { id:6, name:'Divyasree Kumar',  age:32, contact:'+91 43210 98765', condition:'PCOS + Weight',     doctor:'Dr. Raga Deepthi', status:'Active',   lastVisit:'26 Apr 2026', program:'PCOS Healing' },
  { id:7, name:'Rekha Iyer',       age:41, contact:'+91 32109 87654', condition:'Thyroid',           doctor:'Dr. Raga Deepthi', status:'Active',   lastVisit:'15 Apr 2026', program:'Metabolic Reset' },
  { id:8, name:'Padma Venkat',     age:27, contact:'+91 21098 76543', condition:'Irregular Periods', doctor:'Dr. Raga Deepthi', status:'Active',   lastVisit:'24 Apr 2026', program:'PCOS Healing' },
]

export const CONSULTATIONS = [
  { id:1, patient:'Priya Sharma',   date:'26 Apr 2026', time:'10:00 AM', type:'Follow-up', status:'Completed', notes:'Reviewed diet plan, adjusted carb intake. Patient reporting 2 kg weight loss this week. Yoga practice consistent. Continue current protocol.' },
  { id:2, patient:'Ananya Reddy',   date:'26 Apr 2026', time:'11:30 AM', type:'Initial',   status:'Completed', notes:'First consultation. Thyroid panel ordered. Started on anti-inflammatory meal plan.' },
  { id:3, patient:'Kavitha Nair',   date:'27 Apr 2026', time:'09:00 AM', type:'Follow-up', status:'Scheduled', notes:'' },
  { id:4, patient:'Padma Venkat',   date:'27 Apr 2026', time:'02:00 PM', type:'Initial',   status:'Scheduled', notes:'' },
  { id:5, patient:'Meena Krishnan', date:'25 Apr 2026', time:'03:30 PM', type:'Follow-up', status:'Completed', notes:'Excellent progress. Down 4 kg in month 1. Sleep quality improved. Yoga 5×/week consistently.' },
]

export const PAYMENTS = [
  { id:1, patient:'Priya Sharma',    program:'PCOS Healing Workshop',    amount:15000, paid:15000, date:'05 Apr 2026', status:'Paid',    method:'UPI' },
  { id:2, patient:'Ananya Reddy',    program:'Metabolic Reset',          amount:15000, paid:7500,  date:'08 Apr 2026', status:'Partial', method:'Bank Transfer' },
  { id:3, patient:'Meena Krishnan',  program:"Women's Obesity Workshop", amount:15000, paid:15000, date:'01 Apr 2026', status:'Paid',    method:'UPI' },
  { id:4, patient:'Kavitha Nair',    program:'PCOS Healing Workshop',    amount:15000, paid:0,     date:'25 Apr 2026', status:'Pending', method:'—' },
  { id:5, patient:'Divyasree Kumar', program:'1:1 Premium Program',      amount:50000, paid:50000, date:'03 Apr 2026', status:'Paid',    method:'Bank Transfer' },
  { id:6, patient:'Rekha Iyer',      program:'Metabolic Reset',          amount:15000, paid:15000, date:'10 Apr 2026', status:'Paid',    method:'UPI' },
]

export const APPOINTMENTS = [
  { id:1, patient:'Priya Sharma', doctor:'Dr. Raga Deepthi', date:'27 Apr', time:'09:00 AM', type:'Follow-up', status:'Confirmed' },
  { id:2, patient:'Kavitha Nair', doctor:'Dr. Raga Deepthi', date:'27 Apr', time:'10:30 AM', type:'Initial',   status:'Confirmed' },
  { id:3, patient:'Padma Venkat', doctor:'Dr. Raga Deepthi', date:'27 Apr', time:'02:00 PM', type:'Initial',   status:'Pending'   },
  { id:4, patient:'Sunita Patel', doctor:'Dr. Raga Deepthi', date:'28 Apr', time:'11:00 AM', type:'Follow-up', status:'Confirmed' },
  { id:5, patient:'Ananya Reddy', doctor:'Dr. Raga Deepthi', date:'28 Apr', time:'03:00 PM', type:'Follow-up', status:'Pending'   },
]
