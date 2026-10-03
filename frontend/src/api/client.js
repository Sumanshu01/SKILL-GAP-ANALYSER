/**
 * Axios API client — proxied to FastAPI backend via Vite dev server.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 300_000, // 5 min — model inference can be slow
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Unknown error'
    return Promise.reject(new Error(msg))
  }
)

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** Run full analysis */
export async function runAnalysis(formData) {
  const { data } = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/** Get list of available models + thresholds */
export async function fetchModels() {
  const { data } = await api.get('/models')
  return data
}

/** Get ESCO skill taxonomy */
export async function fetchEscoSkills() {
  const { data } = await api.get('/esco/skills')
  return data
}

/** Health check */
export async function checkHealth() {
  const { data } = await axios.get('/health', { timeout: 5000 })
  return data
}

/** Download CSV report */
export function downloadCSV(reportId) {
  window.open(`/api/report/${reportId}/csv`, '_blank')
}

/** Download PDF report */
export function downloadPDF(reportId) {
  window.open(`/api/report/${reportId}/pdf`, '_blank')
}

export default api
