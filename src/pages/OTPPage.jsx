import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Smartphone } from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function OTPPage() {
  const { verifyOTP } = useUser()
  const navigate       = useNavigate()
  const [digits, setDigits]   = useState(['', '', '', '', '', ''])
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const inputs = useRef([])

  // Get pending user info for display
  const pending = (() => {
    try { return JSON.parse(localStorage.getItem('okiru_pending_register') || 'null') } catch { return null }
  })()

  // Auto-focus first input
  useEffect(() => { inputs.current[0]?.focus() }, [])

  const handleDigit = (idx, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[idx] = val
    setDigits(next)
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...digits]
    pasted.split('').forEach((c, i) => { if (i < 6) next[i] = c })
    setDigits(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = digits.join('')
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = verifyOTP(code)
    setLoading(false)
    if (result.ok) {
      navigate('/', { replace: true })
    } else {
      setError(result.error)
      setDigits(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    }
  }

  return (
    <div className="auth-page">
      <div style={{ paddingTop: 16 }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--neutral-600)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, padding: '8px 0' }}>
          <ChevronLeft size={18} /> Kembali
        </button>
      </div>

      <motion.div
        className="auth-hero"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ paddingTop: 32, paddingBottom: 24 }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'linear-gradient(135deg, #9BC438, #6A9A1F)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(155,196,56,0.4)'
        }}>
          <Smartphone size={34} color="#fff" />
        </div>
        <span className="auth-brand">Verifikasi OTP</span>
        <span className="auth-sub" style={{ textAlign: 'center' }}>
          Kode OTP dikirim ke{' '}
          <strong style={{ color: 'var(--primary-dark)' }}>
            {pending?.phone || 'nomormu'}
          </strong>
        </span>
        <span style={{ fontSize: 11, color: 'var(--neutral-400)', textAlign: 'center' }}>
          (Prototype: masukkan kode apa saja, min. 4 digit)
        </span>
      </motion.div>

      <motion.form
        className="auth-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        {error && (
          <motion.div className="error-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {error}
          </motion.div>
        )}

        <div className="otp-inputs" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              ref={el => inputs.current[i] = el}
              className="otp-input"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <button
          id="otp-submit"
          type="submit"
          className="btn btn-primary btn-full btn-lg"
          disabled={loading || digits.join('').length < 4}
          style={{ marginTop: 16 }}
        >
          {loading ? 'Memverifikasi...' : 'Verifikasi'}
        </button>

        <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-dark)', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 14, padding: '8px 0', textAlign: 'center' }}>
          Kirim Ulang Kode
        </button>
      </motion.form>
    </div>
  )
}
