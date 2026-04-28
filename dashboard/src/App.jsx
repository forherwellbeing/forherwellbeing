import { useState, useEffect } from 'react'
import { mkT, TWEAK_DEFAULTS } from './theme'
import { useNotifications } from './hooks/useNotifications'
import { useIsMobile } from './hooks/useIsMobile'

import Sidebar      from './components/Sidebar'
import TopBar       from './components/TopBar'

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
  const T = mkT(TWEAK_DEFAULTS)
  const { notifications, unreadCount, markAllRead } = useNotifications()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  useEffect(() => { if (!isMobile) setSidebarOpen(false) }, [isMobile])

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
    } else {
      if (page === 'overview')     return <StaffOverview T={T} />
      if (page === 'patients')     return <StaffPatients T={T} />
      if (page === 'appointments') return <StaffAppts    T={T} />
      if (page === 'billing')      return <StaffBilling  T={T} />
      if (page === 'reports')      return <Reports        T={T} />
    }
    return null
  }

  return (
    <div style={{ display:'flex', height:'100vh', background:T.bg }}>
      <Sidebar
        role={user.role}
        activePage={page}
        setActivePage={setPage}
        onLogout={() => { setUser(null); setPage('overview') }}
        T={T}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div style={{ flex:1, marginLeft: isMobile ? 0 : 238, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <TopBar
          title={title}
          role={user.role}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          isMobile={isMobile}
          onMenuToggle={() => setSidebarOpen(v => !v)}
        />
        <div style={{ flex:1, overflowY:'auto', padding: isMobile ? '16px' : '22px 26px' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  )
}
