import { useState, useEffect } from 'react'
import Modal from './Modal'
import Btn   from './Button'
import { FF, Input, Sel, Textarea2 } from './FormField'
import { useIsMobile } from '../../hooks/useIsMobile'

const PRIMARY_CONCERNS = [
  'PCOS','Weight Management / Obesity','Thyroid','Diabetes / Prediabetes',
  'Fertility / Trying to Conceive','Fatigue / Brain Fog','Pregnancy','Postnatal Recovery',
  'Autoimmune','Hormonal / Period Issues','Menopause / Perimenopause','Gut Health',
]
const DIAGNOSED = [
  'PCOS','Hypothyroid','Hyperthyroid','Type 2 Diabetes','Prediabetes',
  'Hypertension','Fatty Liver','Hashimoto\'s','Endometriosis',
  'IBS / IBD','Food Allergies','Kidney Disease','Other',
]
const SYMPTOMS = [
  { k:'acne_hair_loss', label:'Acne / hair loss / facial hair growth (androgen excess)' },
  { k:'always_cold',    label:'Always cold / dry skin / hair fall (thyroid)' },
  { k:'bloating_gut',   label:'Bloating / gas / constipation / loose stools (gut)' },
  { k:'frequent_uti',   label:'Frequent UTIs / yeast infections (microbiome)' },
  { k:'sugar_cravings', label:'Sugar cravings / energy crashes after meals (insulin)' },
  { k:'mood_swings',    label:'Mood swings / anxiety / low mood' },
  { k:'joint_pain',     label:'Joint pain / morning stiffness (autoimmune)' },
  { k:'heavy_periods',  label:'Heavy / painful / missing periods' },
  { k:'brain_fog',      label:'Brain fog / poor concentration' },
  { k:'hot_flashes',    label:'Hot flashes / night sweats (perimenopause)' },
]
const SECS = [
  { id:'identity',     label:'Identity' },
  { id:'body',         label:'Measurements' },
  { id:'conditions',   label:'Conditions' },
  { id:'reproductive', label:'Hormonal' },
  { id:'dietary',      label:'Diet' },
  { id:'lifestyle',    label:'Lifestyle' },
  { id:'eating',       label:'Eating' },
  { id:'symptoms',     label:'Symptoms' },
  { id:'reports',      label:'Reports' },
]
const BLANK = {
  identity:     { dob:'', sex:'Female', city:'', country:'India', language:'English' },
  body:         { weight_kg:'', height_cm:'', target_weight_kg:'', waist_cm:'' },
  conditions:   { primary_concerns:[], diagnosed:[], medications:'' },
  reproductive: { life_stage:'', cycle_regularity:'', pregnant_trimester:'', gestational_diabetes:'', postnatal_months:'', breastfeeding:'', last_period:'' },
  dietary:      { diet_type:'', dairy:'yes', gluten:'yes', allergies:'', dislikes:'', cuisine:'', cooking_ability:'' },
  lifestyle:    { activity_level:'', sleep_hours:'', sleep_quality:'', stress_level:'', water_litres:'', smoking:'no', alcohol:'no', work_schedule:'' },
  eating:       { wake_time:'', sleep_time:'', meals_per_day:'', skips_breakfast:'No', eats_outside:'', snacking:'', tea_coffee:'' },
  symptoms:     { acne_hair_loss:false, always_cold:false, bloating_gut:false, frequent_uti:false, sugar_cravings:false, mood_swings:false, joint_pain:false, heavy_periods:false, brain_fog:false, hot_flashes:false },
  reports:      { report_date:'', blood_params:'', notes:'' },
}

function Chk({ checked, onChange, label, accent }) {
  return (
    <label style={{ display:'flex', alignItems:'flex-start', gap:9, cursor:'pointer', fontSize:13, color:'#1A1A2E', lineHeight:1.4 }}>
      <input type="checkbox" checked={checked} onChange={onChange}
        style={{ width:15, height:15, marginTop:2, accentColor: accent || '#B05A72', cursor:'pointer', flexShrink:0 }} />
      {label}
    </label>
  )
}

function Grid2({ isMobile, children }) {
  return <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:12 }}>{children}</div>
}

export default function IntakeModal({ patient, open, onClose, onSave, T }) {
  const [sec, setSec]     = useState('identity')
  const [form, setForm]   = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const isMobile = useIsMobile()
  const accent = T?.accent || '#B05A72'

  useEffect(() => {
    if (!open) return
    const d = patient?.intake_data
    if (d && typeof d === 'object') {
      setForm(Object.fromEntries(Object.keys(BLANK).map(k => [k, { ...BLANK[k], ...(d[k] || {}) }])))
    } else {
      setForm(BLANK)
    }
    setSec('identity')
  }, [open, patient])

  const updE = (s, k) => e => setForm(f => ({ ...f, [s]: { ...f[s], [k]: e.target.value } }))
  const updV = (s, k) => v  => setForm(f => ({ ...f, [s]: { ...f[s], [k]: v } }))
  const toggleArr = (s, k, v) => setForm(f => {
    const arr = Array.isArray(f[s][k]) ? f[s][k] : []
    return { ...f, [s]: { ...f[s], [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] } }
  })
  const toggleBool = (s, k) => setForm(f => ({ ...f, [s]: { ...f[s], [k]: !f[s][k] } }))

  const handleSave = async () => {
    setSaving(true)
    await onSave(patient.id, { intake_data: form })
    setSaving(false)
    onClose()
  }

  const secIdx = SECS.findIndex(s => s.id === sec)
  const f = form

  const renderSection = () => {
    switch (sec) {
      case 'identity': return (
        <Grid2 isMobile={isMobile}>
          <FF label="Date of Birth"><Input type="date" value={f.identity.dob} onChange={updE('identity','dob')} /></FF>
          <FF label="Sex">
            <Sel value={f.identity.sex} onChange={updE('identity','sex')}>
              <option>Female</option><option>Other</option>
            </Sel>
          </FF>
          <FF label="City / Town"><Input value={f.identity.city} onChange={updE('identity','city')} placeholder="e.g. Hyderabad" /></FF>
          <FF label="Country"><Input value={f.identity.country} onChange={updE('identity','country')} placeholder="India" /></FF>
          <FF label="Preferred Language for Plan">
            <Sel value={f.identity.language} onChange={updE('identity','language')}>
              <option>English</option><option>Telugu</option><option>Hindi</option>
              <option>Tamil</option><option>Kannada</option><option>Malayalam</option><option>Other</option>
            </Sel>
          </FF>
        </Grid2>
      )

      case 'body': return (
        <div>
          <Grid2 isMobile={isMobile}>
            <FF label="Current Weight (kg) *"><Input type="number" value={f.body.weight_kg} onChange={updE('body','weight_kg')} placeholder="72" min="20" max="300" /></FF>
            <FF label="Height (cm) *"><Input type="number" value={f.body.height_cm} onChange={updE('body','height_cm')} placeholder="162" min="100" max="220" /></FF>
            <FF label="Target Weight (kg)"><Input type="number" value={f.body.target_weight_kg} onChange={updE('body','target_weight_kg')} placeholder="60 (if weight loss goal)" min="30" max="200" /></FF>
            <FF label="Waist Circumference (cm)">
              <Input type="number" value={f.body.waist_cm} onChange={updE('body','waist_cm')} placeholder="86 (measure at navel)" min="40" max="200" />
            </FF>
          </Grid2>
          {f.body.weight_kg && f.body.height_cm && (
            <div style={{ padding:'10px 14px', background:'#F4E8EC', borderRadius:8, fontSize:13, color:accent, fontWeight:500, marginTop:4 }}>
              BMI: {(f.body.weight_kg / ((f.body.height_cm/100) ** 2)).toFixed(1)}
            </div>
          )}
        </div>
      )

      case 'conditions': return (
        <div>
          <FF label="Primary Concern (select all that apply)">
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:8, padding:'12px', background:'#FAF8F5', borderRadius:9, border:'1.5px solid #EDE8E5' }}>
              {PRIMARY_CONCERNS.map(c => (
                <Chk key={c} accent={accent} label={c}
                  checked={(f.conditions.primary_concerns || []).includes(c)}
                  onChange={() => toggleArr('conditions','primary_concerns', c)} />
              ))}
            </div>
          </FF>
          <FF label="Diagnosed Conditions (select all confirmed by doctor)">
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:8, padding:'12px', background:'#FAF8F5', borderRadius:9, border:'1.5px solid #EDE8E5' }}>
              {DIAGNOSED.map(c => (
                <Chk key={c} accent={accent} label={c}
                  checked={(f.conditions.diagnosed || []).includes(c)}
                  onChange={() => toggleArr('conditions','diagnosed', c)} />
              ))}
            </div>
          </FF>
          <FF label="Current Medications (name + dose, one per line)">
            <Textarea2 rows={4} value={f.conditions.medications} onChange={updE('conditions','medications')}
              placeholder="e.g. Metformin 500mg twice daily&#10;Levothyroxine 50mcg&#10;Combined OCP (Diane-35)" />
          </FF>
        </div>
      )

      case 'reproductive': return (
        <div>
          <Grid2 isMobile={isMobile}>
            <FF label="Life Stage *">
              <Sel value={f.reproductive.life_stage} onChange={updE('reproductive','life_stage')}>
                <option value="">Select…</option>
                <option>Puberty / Adolescence</option>
                <option>Reproductive Years (not pregnant)</option>
                <option>Trying to Conceive</option>
                <option>Pregnant</option>
                <option>Postnatal / Breastfeeding</option>
                <option>Perimenopause</option>
                <option>Menopause / Post-menopause</option>
              </Sel>
            </FF>
            <FF label="Menstrual Cycle Regularity">
              <Sel value={f.reproductive.cycle_regularity} onChange={updE('reproductive','cycle_regularity')}>
                <option value="">Select…</option>
                <option>Regular (every 21–35 days)</option>
                <option>Irregular</option>
                <option>Absent (amenorrhea)</option>
                <option>Post-menopausal (no periods)</option>
                <option>On hormonal contraceptive</option>
              </Sel>
            </FF>
            {['Pregnant','Trying to Conceive'].includes(f.reproductive.life_stage) && (
              <>
                <FF label="Trimester (if pregnant)">
                  <Sel value={f.reproductive.pregnant_trimester} onChange={updE('reproductive','pregnant_trimester')}>
                    <option value="">Select…</option>
                    <option>1st trimester (0–12 weeks)</option>
                    <option>2nd trimester (13–26 weeks)</option>
                    <option>3rd trimester (27+ weeks)</option>
                    <option>Not pregnant (TTC)</option>
                  </Sel>
                </FF>
                <FF label="Gestational Diabetes?">
                  <Sel value={f.reproductive.gestational_diabetes} onChange={updE('reproductive','gestational_diabetes')}>
                    <option value="">Select…</option><option>Yes</option><option>No</option><option>Not tested yet</option>
                  </Sel>
                </FF>
              </>
            )}
            {f.reproductive.life_stage === 'Postnatal / Breastfeeding' && (
              <>
                <FF label="Months Since Delivery">
                  <Input type="number" value={f.reproductive.postnatal_months} onChange={updE('reproductive','postnatal_months')} placeholder="e.g. 3" min="0" max="36" />
                </FF>
                <FF label="Currently Breastfeeding?">
                  <Sel value={f.reproductive.breastfeeding} onChange={updE('reproductive','breastfeeding')}>
                    <option value="">Select…</option><option>Yes, exclusively</option><option>Yes, partially</option><option>No</option>
                  </Sel>
                </FF>
              </>
            )}
            <FF label="Last Period Date (approximate)">
              <Input type="date" value={f.reproductive.last_period} onChange={updE('reproductive','last_period')} />
            </FF>
          </Grid2>
        </div>
      )

      case 'dietary': return (
        <Grid2 isMobile={isMobile}>
          <FF label="Diet Type *">
            <Sel value={f.dietary.diet_type} onChange={updE('dietary','diet_type')}>
              <option value="">Select…</option>
              <option>Vegetarian</option><option>Vegan</option><option>Eggetarian</option>
              <option>Non-Vegetarian</option><option>Jain (no root veg)</option>
            </Sel>
          </FF>
          <FF label="Dairy Consumption">
            <Sel value={f.dietary.dairy} onChange={updE('dietary','dairy')}>
              <option value="yes">Yes — tolerate well</option>
              <option value="lactose">Lactose intolerant</option>
              <option value="no">No dairy</option>
            </Sel>
          </FF>
          <FF label="Gluten Tolerance">
            <Sel value={f.dietary.gluten} onChange={updE('dietary','gluten')}>
              <option value="yes">Yes — no issues</option>
              <option value="sensitive">Sensitive / bloating</option>
              <option value="no">Avoiding gluten</option>
              <option value="celiac">Celiac disease</option>
            </Sel>
          </FF>
          <FF label="Cuisine Preference">
            <Sel value={f.dietary.cuisine} onChange={updE('dietary','cuisine')}>
              <option value="">Select…</option>
              <option>South Indian</option><option>North Indian</option><option>Mixed Indian</option>
              <option>International / Western</option><option>No preference</option>
            </Sel>
          </FF>
          <FF label="Cooking Ability">
            <Sel value={f.dietary.cooking_ability} onChange={updE('dietary','cooking_ability')}>
              <option value="">Select…</option>
              <option>Cooks daily (self)</option><option>Cooks occasionally</option>
              <option>Family / partner cooks</option><option>Has a cook / maid</option><option>Relies on outside food</option>
            </Sel>
          </FF>
          <div style={{ gridColumn: isMobile ? undefined : '1 / -1' }}>
            <FF label="Food Allergies / Intolerances">
              <Input value={f.dietary.allergies} onChange={updE('dietary','allergies')} placeholder="e.g. nuts, soy, shellfish, eggs — or 'none'" />
            </FF>
          </div>
          <div style={{ gridColumn: isMobile ? undefined : '1 / -1' }}>
            <FF label="Foods Disliked / Strongly Avoided">
              <Input value={f.dietary.dislikes} onChange={updE('dietary','dislikes')} placeholder="e.g. bhindi, bitter gourd, mushrooms" />
            </FF>
          </div>
        </Grid2>
      )

      case 'lifestyle': return (
        <Grid2 isMobile={isMobile}>
          <FF label="Activity Level *">
            <Sel value={f.lifestyle.activity_level} onChange={updE('lifestyle','activity_level')}>
              <option value="">Select…</option>
              <option>Sedentary (desk job, minimal movement)</option>
              <option>Lightly active (walks, light work)</option>
              <option>Moderately active (gym 3–4x/week)</option>
              <option>Very active (daily intense exercise)</option>
              <option>Physically demanding job</option>
            </Sel>
          </FF>
          <FF label="Work Schedule">
            <Sel value={f.lifestyle.work_schedule} onChange={updE('lifestyle','work_schedule')}>
              <option value="">Select…</option>
              <option>Regular (9am–6pm)</option><option>Shift work (day/night rotation)</option>
              <option>Night shifts</option><option>Irregular / freelance</option><option>Homemaker</option>
            </Sel>
          </FF>
          <FF label="Average Sleep (hours/night)">
            <Input type="number" value={f.lifestyle.sleep_hours} onChange={updE('lifestyle','sleep_hours')} placeholder="7" min="2" max="14" />
          </FF>
          <FF label="Sleep Quality">
            <Sel value={f.lifestyle.sleep_quality} onChange={updE('lifestyle','sleep_quality')}>
              <option value="">Select…</option>
              <option>Good (refreshed on waking)</option><option>Disturbed (wakes during night)</option>
              <option>Insomnia (difficulty falling asleep)</option><option>Oversleeping / fatigue</option>
            </Sel>
          </FF>
          <FF label="Self-rated Stress Level">
            <Sel value={f.lifestyle.stress_level} onChange={updE('lifestyle','stress_level')}>
              <option value="">Select…</option>
              <option>Low</option><option>Moderate</option><option>High</option><option>Very high / overwhelmed</option>
            </Sel>
          </FF>
          <FF label="Water Intake (litres/day)">
            <Input type="number" step="0.5" value={f.lifestyle.water_litres} onChange={updE('lifestyle','water_litres')} placeholder="1.5" min="0.5" max="10" />
          </FF>
          <FF label="Smoking">
            <Sel value={f.lifestyle.smoking} onChange={updE('lifestyle','smoking')}>
              <option value="no">No</option>
              <option value="occasionally">Occasionally</option><option value="daily">Daily</option>
            </Sel>
          </FF>
          <FF label="Alcohol">
            <Sel value={f.lifestyle.alcohol} onChange={updE('lifestyle','alcohol')}>
              <option value="no">No</option>
              <option value="occasional">Occasional (1–2x/month)</option>
              <option value="weekly">Weekly</option><option value="daily">Daily</option>
            </Sel>
          </FF>
        </Grid2>
      )

      case 'eating': return (
        <Grid2 isMobile={isMobile}>
          <FF label="Typical Wake-up Time"><Input type="time" value={f.eating.wake_time} onChange={updE('eating','wake_time')} /></FF>
          <FF label="Typical Sleep Time"><Input type="time" value={f.eating.sleep_time} onChange={updE('eating','sleep_time')} /></FF>
          <FF label="Meals Per Day Currently">
            <Sel value={f.eating.meals_per_day} onChange={updE('eating','meals_per_day')}>
              <option value="">Select…</option>
              <option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option>
            </Sel>
          </FF>
          <FF label="Skips Breakfast?">
            <Sel value={f.eating.skips_breakfast} onChange={updE('eating','skips_breakfast')}>
              <option value="No">No — eats breakfast daily</option>
              <option value="Sometimes">Sometimes (2–3x/week)</option>
              <option value="Often">Often (most days)</option>
              <option value="Always">Always skips</option>
            </Sel>
          </FF>
          <FF label="Outside Food Frequency">
            <Sel value={f.eating.eats_outside} onChange={updE('eating','eats_outside')}>
              <option value="">Select…</option>
              <option>Rarely (once a month)</option>
              <option>1–2x per week</option>
              <option>3–5x per week</option>
              <option>Daily</option>
            </Sel>
          </FF>
          <div style={{ gridColumn: isMobile ? undefined : '1 / -1' }}>
            <FF label="Tea / Coffee Intake">
              <Input value={f.eating.tea_coffee} onChange={updE('eating','tea_coffee')} placeholder="e.g. 3 cups tea with sugar, 1 black coffee" />
            </FF>
          </div>
          <div style={{ gridColumn: isMobile ? undefined : '1 / -1' }}>
            <FF label="Typical Snacking Habits">
              <Input value={f.eating.snacking} onChange={updE('eating','snacking')} placeholder="e.g. tea + biscuits at 4pm, fruits, nothing, namkeen" />
            </FF>
          </div>
        </Grid2>
      )

      case 'symptoms': return (
        <div>
          <div style={{ fontSize:13, color:'#7A7A8A', marginBottom:14, lineHeight:1.6 }}>
            Select all symptoms the patient has experienced in the <strong>last 3 months</strong>. These map directly to clinical flags.
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {SYMPTOMS.map(({ k, label }) => (
              <Chk key={k} accent={accent} label={label}
                checked={!!f.symptoms[k]}
                onChange={() => toggleBool('symptoms', k)} />
            ))}
          </div>
          {Object.values(f.symptoms).filter(Boolean).length > 0 && (
            <div style={{ marginTop:16, padding:'10px 14px', background:'#FFF3E8', borderRadius:8, fontSize:12.5, color:'#7A5A2D', fontWeight:500 }}>
              {Object.values(f.symptoms).filter(Boolean).length} symptom(s) flagged — review against conditions in Section 3
            </div>
          )}
        </div>
      )

      case 'reports': return (
        <div>
          <div style={{ padding:'10px 14px', background:'#EBF0FB', borderRadius:8, fontSize:12.5, color:'#2A4FA0', marginBottom:16, lineHeight:1.6 }}>
            <strong>Minimum required (Precision Diet Plan):</strong> CBC, fasting glucose, HbA1c, fasting insulin, lipid profile, TSH, Vitamin D, Vitamin B12, ferritin — within last 6 months.
          </div>
          <Grid2 isMobile={isMobile}>
            <FF label="Blood Report Date">
              <Input type="date" value={f.reports.report_date} onChange={updE('reports','report_date')} />
            </FF>
          </Grid2>
          <FF label="Key Blood Parameters (values from report)">
            <Textarea2 rows={6} value={f.reports.blood_params} onChange={updE('reports','blood_params')}
              placeholder="e.g.&#10;HbA1c: 5.8%&#10;Fasting glucose: 95 mg/dL&#10;Fasting insulin: 18 µIU/mL&#10;TSH: 4.2 mIU/L&#10;Vitamin D: 14 ng/mL (deficient)&#10;Vitamin B12: 220 pg/mL&#10;Ferritin: 8 ng/mL (low)" />
          </FF>
          <FF label="Additional Notes / Observations">
            <Textarea2 rows={3} value={f.reports.notes} onChange={updE('reports','notes')}
              placeholder="Any unusual findings, pending tests, or clinical context from the consultation…" />
          </FF>
        </div>
      )

      default: return null
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Health Intake — ${patient?.name || ''}`} width={isMobile ? undefined : 760}>
      {/* Section tab bar */}
      <div style={{ display:'flex', gap:4, overflowX:'auto', paddingBottom:12, borderBottom:'1px solid #EDE8E5', marginBottom:20 }}>
        {SECS.map((s, i) => (
          <button key={s.id} onClick={() => setSec(s.id)} style={{
            padding:'6px 12px', borderRadius:20, border:`1.5px solid ${sec===s.id ? accent : '#EDE8E5'}`,
            background: sec===s.id ? accent + '15' : '#fff',
            color: sec===s.id ? accent : '#7A7A8A',
            fontSize:12, fontWeight: sec===s.id ? 600 : 400,
            cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0, transition:'all 0.12s',
          }}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div style={{ minHeight:260 }}>
        {renderSection()}
      </div>

      {/* Footer navigation */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20, paddingTop:16, borderTop:'1px solid #EDE8E5' }}>
        <Btn variant="ghost" T={T} onClick={() => secIdx > 0 && setSec(SECS[secIdx - 1].id)} disabled={secIdx === 0}>
          ← Back
        </Btn>
        <span style={{ fontSize:12, color:'#7A7A8A' }}>{secIdx + 1} / {SECS.length}</span>
        <div style={{ display:'flex', gap:10 }}>
          <Btn variant="ghost" T={T} onClick={onClose}>Cancel</Btn>
          {secIdx < SECS.length - 1
            ? <Btn variant="primary" T={T} onClick={() => setSec(SECS[secIdx + 1].id)}>Next →</Btn>
            : <Btn variant="primary" T={T} onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Intake'}</Btn>
          }
        </div>
      </div>
    </Modal>
  )
}
