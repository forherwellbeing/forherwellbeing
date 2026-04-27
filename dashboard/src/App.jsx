import { useEffect, useState } from 'react'
import { useTweaks } from './hooks/useTweaks'
import { mkT, TWEAK_DEFAULTS } from './theme'

import Sidebar      from './components/Sidebar'
import TopBar       from './components/TopBar'
import TweaksPanel  from './components/TweaksPanel'

import Login            from './pages/Login'
import DoctorOverview   from './pages/doctor/Overview'
import DoctorPatients   from './pages/doctor/Patients'
import DoctorConsults   from './pages/doctor/Consultations'
import DoctorRx         from './pages/doctor/Prescriptions'
import StaffOverview    from './pages/staff/Overview'
import StaffPatients    from './pages/staff/Patients'
import StaffAppts       from './pages/staff/Appointments'
import StaffBilling     from './pages/staff/Billing'
import Reports          from './pages/shared/Reports'
import Profile          from './pages/shared/Profile'

const PAGE_TITLE = {
  overview:      'Dashboard',
  patients:      'Patients',
  consultations: 'Consultations',
  prescriptions: 'Prescriptions',
  appointments:  'Appointments',
  billing:       'Billing & Payments',
  reports:       'Reports',
  profile:       'Profile',
}

const DASHBOARD_USER_KEY = 'fhw_dashboard_user'
const DASHBOARD_PAGE_KEY = 'fhw_dashboard_page'

export default function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS)
  const T = mkT(tweaks)

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(DASHBOARD_USER_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [page, setPage] = useState(() => localStorage.getItem(DASHBOARD_PAGE_KEY) || 'overview')

  useEffect(() => {
    if (user) localStorage.setItem(DASHBOARD_USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(DASHBOARD_USER_KEY)
  }, [user])

  useEffect(() => {
    localStorage.setItem(DASHBOARD_PAGE_KEY, page)
  }, [page])

  if (!user) {
    return <Login onLogin={role => { setUser({ role }); setPage('overview') }} />
  }

  const title = page === 'patients' && user.role === 'staff' ? 'Patient Management' : PAGE_TITLE[page] || 'Dashboard'

  const renderPage = () => {
    if (user.role === 'doctor') {
      if (page === 'overview')      return <DoctorOverview T={T} />
      if (page === 'patients')      return <DoctorPatients T={T} />
      if (page === 'consultations') return <DoctorConsults T={T} />
      if (page === 'prescriptions') return <DoctorRx       T={T} />
      if (page === 'reports')       return <Reports         T={T} />
      if (page === 'profile')       return <Profile role="doctor" T={T} />
    } else {
      if (page === 'overview')     return <StaffOverview T={T} />
      if (page === 'patients')     return <StaffPatients T={T} />
      if (page === 'appointments') return <StaffAppts    T={T} />
      if (page === 'billing')      return <StaffBilling  T={T} />
      if (page === 'reports')      return <Reports        T={T} />
      if (page === 'profile')      return <Profile role="staff" T={T} />
    }
    return null
  }

  return (
    <div style={{ display:'flex', height:'100vh', background:T.bg }}>
      <Sidebar
        role={user.role}
        activePage={page}
        setActivePage={setPage}
        onLogout={() => {
          setUser(null)
          setPage('overview')
        }}
        T={T}
      />
      <div style={{ flex:1, marginLeft:238, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <TopBar title={title} role={user.role} />
        <div style={{ flex:1, overflowY:'auto', padding:'22px 26px' }}>
          {renderPage()}
        </div>
      </div>
      <TweaksPanel tweaks={tweaks} setTweak={setTweak} />
    </div>
  )
}
