import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const channel = supabase
      .channel('notifications-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'patients' }, payload => {
        setNotifications(prev => [{
          id:      payload.new.id,
          name:    payload.new.name || 'New Patient',
          program: payload.new.program || 'Initial Consultation',
          amount:  payload.new.amount_paid || 0,
          time:    new Date(),
          read:    false,
        }, ...prev].slice(0, 20))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const unreadCount = notifications.filter(n => !n.read).length

  return { notifications, unreadCount, markAllRead }
}
