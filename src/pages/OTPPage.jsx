import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Smartphone } from 'lucide-react'
import { useUserStore as useUser } from '../store/useUserStore'

export default function OTPPage() {
  const { verifyOTP } = useUser()
  const navigate       = useNavigate()
  const [digits, setDigits]   = useState(['', '', '', '', '', ''])
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputs = useRef([])

  // Get pending user info for display
  const pending = (() => {
    try { return JSON.parse(localStorage.getItem('okiru_pending_register') || 'null') } catch { return null }
  })()

  // Auto-focus first input
  useEffect(() => { inputs.current[0]?.focus() }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleResend = () => {
    setCountdown(30)
    setCanResend(false)
  }

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

  const filledCount = digits.filter(d => d !== '').length

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
        <motion.div
          style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #9BC438, #6A9A1F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(155,196,56,0.4)'
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <Smartphone size={34} color="#fff" />
        </motion.div>
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
        style={{ padding: '0 20px' }}
      >
        {error && (
          <motion.div className="error-banner" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {error}
          </motion.div>
        )}

        <div className="otp-inputs" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <motion.input
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
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, margin: '12px 0 4px' }}>
          {[0,1,2,3,4,5].map(i => (
            <motion.div
              key={i}
              style={{
                width: 8, height: 3, borderRadius: 2,
                background: i < filledCount ? 'var(--primary)' : 'var(--neutral-200)',
              }}
              animate={{ scaleX: i < filledCount ? 1 : 0.6 }}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>

        <motion.button
          id="otp-submit"
          type="submit"
          className="btn btn-primary btn-full btn-lg"
          disabled={loading || digits.join('').length < 4}
          style={{ marginTop: 16 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? (
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              Memverifikasi...
            </motion.span>
          ) : 'Verifikasi'}
        </motion.button>

        {/* Resend with countdown */}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          {canResend ? (
            <motion.button
              type="button"
              onClick={handleResend}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--primary-dark)', fontFamily: 'var(--font)',
                fontWeight: 700, fontSize: 14, padding: '8px 0'
              }}
            >
              Kirim Ulang Kode
            </motion.button>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--neutral-400)', fontWeight: 600 }}>
              Kirim ulang dalam{' '}
              <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>
                {countdown}s
              </span>
            </p>
          )}
        </div>
      </motion.form>
    </div>
  )
}
