import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function usePatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setPatients(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()

    // Real-time: new patient paid on homepage → appears in dashboard instantly
    const channel = supabase
      .channel('patients-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'patients' }, payload => {
        setPatients(prev => [payload.new, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'patients' }, payload => {
        setPatients(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'patients' }, payload => {
        setPatients(prev => prev.filter(p => p.id !== payload.old.id))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetch])

  const addPatient = async (patient) => {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single()
    if (!error) setPatients(prev => [data, ...prev])
    return { data, error }
  }

  const updatePatient = async (id, updates) => {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setPatients(prev => prev.map(p => p.id === id ? data : p))
    return { data, error }
  }

  const deletePatient = async (id) => {
    const { error } = await supabase.from('patients').delete().eq('id', id)
    if (!error) setPatients(prev => prev.filter(p => p.id !== id))
    return { error }
  }

  return { patients, loading, error, addPatient, updatePatient, deletePatient, refetch: fetch }
}
