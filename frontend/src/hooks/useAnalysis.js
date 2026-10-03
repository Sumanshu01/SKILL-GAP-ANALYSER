import { useState, useCallback, useEffect } from 'react'
import { runAnalysis } from '../api/client'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'ai_resume_latest_analysis'

export function useAnalysis() {
  const [result, setResult] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [error, setError] = useState(null)

  // Persist result into sessionStorage for tab lifecycle
  useEffect(() => {
    if (result) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result))
      } catch (e) {
        console.warn('Failed to cache result in sessionStorage', e)
      }
    }
  }, [result])

  const analyze = useCallback(
    async ({ resumeFile, resumeText, jdFile, jdText, modelName = 'Proposed Hybrid' }) => {
      setLoading(true)
      setError(null)
      setLoadingStep('Uploading documents...')

      try {
        const formData = new FormData()

        if (resumeFile) {
          formData.append('resume_file', resumeFile)
        } else if (resumeText) {
          formData.append('resume_text', resumeText)
        }

        if (jdFile) {
          formData.append('jd_file', jdFile)
        } else if (jdText) {
          formData.append('jd_text', jdText)
        }

        formData.append('model_name', modelName)

        // Stage updates for UX during longer inference
        const stepTimer1 = setTimeout(() => {
          setLoadingStep('Extracting skills against ESCO taxonomy...')
        }, 1200)

        const stepTimer2 = setTimeout(() => {
          setLoadingStep('Computing semantic similarity & implicit dependencies...')
        }, 3000)

        const stepTimer3 = setTimeout(() => {
          setLoadingStep('Synthesizing upskilling roadmap & model benchmarks...')
        }, 5500)

        const data = await runAnalysis(formData)

        clearTimeout(stepTimer1)
        clearTimeout(stepTimer2)
        clearTimeout(stepTimer3)

        setResult(data)
        toast.success(`Analysis completed with ${modelName}!`)
        return data
      } catch (err) {
        const msg = err.message || 'Analysis failed. Please check inputs and try again.'
        setError(msg)
        toast.error(msg)
        throw err
      } finally {
        setLoading(false)
        setLoadingStep('')
      }
    },
    []
  )

  const clear = useCallback(() => {
    setResult(null)
    setError(null)
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  return {
    result,
    loading,
    loadingStep,
    error,
    analyze,
    clear,
    hasResult: Boolean(result),
  }
}
