import { useState, useEffect, useCallback } from 'react'
import { checkHealth } from '../api/client'

export function useApiStatus(pollIntervalMs = 12000) {
  const [status, setStatus] = useState('checking')
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [device, setDevice] = useState('unknown')
  const [escoSkillsCount, setEscoSkillsCount] = useState(0)
  const [error, setError] = useState(null)

  const check = useCallback(async () => {
    try {
      const data = await checkHealth()
      setStatus(data.status || 'ok')
      setModelsLoaded(Boolean(data.models_loaded))
      setDevice(data.device || 'cpu')
      setEscoSkillsCount(data.esco_skills_count || 0)
      setError(null)
    } catch (err) {
      setStatus('offline')
      setModelsLoaded(false)
      setError(err.message || 'Backend unreachable')
    }
  }, [])

  useEffect(() => {
    check()
    const timer = setInterval(check, pollIntervalMs)
    return () => clearInterval(timer)
  }, [check, pollIntervalMs])

  return {
    status,
    modelsLoaded,
    device,
    escoSkillsCount,
    isOnline: status === 'ok',
    isInitializing: status === 'initializing',
    isOffline: status === 'offline',
    error,
    refresh: check,
  }
}
