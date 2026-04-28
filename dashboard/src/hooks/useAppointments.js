import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true); setError(null)
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
    if (error) setError(error.message)
    else setAppointments(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()
    const channel = supabase
      .channel('appointments-live')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'appointments' }, p => {
        setAppointments(prev => [...prev, p.new].sort((a,b) => a.appointment_date.localeCompare(b.appointment_date) || a.appointment_time.localeCompare(b.appointment_time)))
      })
      .on('postgres_changes', { event:'UPDATE', schema:'public', table:'appointments' }, p => {
        setAppointments(prev => prev.map(a => a.id === p.new.id ? p.new : a))
      })
      .on('postgres_changes', { event:'DELETE', schema:'public', table:'appointments' }, p => {
        setAppointments(prev => prev.filter(a => a.id !== p.old.id))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetch])

  const addAppointment = async appt => {
    const { data, error } = await supabase.from('appointments').insert(appt).select().single()
    if (!error) setAppointments(prev => [...prev, data].sort((a,b) => a.appointment_date.localeCompare(b.appointment_date) || a.appointment_time.localeCompare(b.appointment_time)))
    return { data, error }
  }

  const updateAppointment = async (id, updates) => {
    const { data, error } = await supabase.from('appointments').update(updates).eq('id', id).select().single()
    if (!error) setAppointments(prev => prev.map(a => a.id === id ? data : a))
    return { data, error }
  }

  const deleteAppointment = async id => {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (!error) setAppointments(prev => prev.filter(a => a.id !== id))
    return { error }
  }

  return { appointments, loading, error, addAppointment, updateAppointment, deleteAppointment, refetch: fetch }
}
