import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Headset, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore as useUser } from '../store/useUserStore'
import './LiveChatPage.css'

const CS_NAME = 'Okiru CS Team'
const CS_AVATAR = '🎧'

const QUICK_REPLIES = [
  'Status pesanan saya?',
  'Cara tukar poin?',
  'Produk baru OkiruDrink?',
  'Jam operasional outlet?',
  'Cara batalkan pesanan?',
]

const AUTO_RESPONSES = {
  'status pesanan': 'Halo kak! 😊 Untuk cek status pesanan, silakan buka menu **Riwayat Pesanan** di halaman Profil. Atau bisa share nomor pesananmu di sini, nanti kami cek langsung ya!',
  'tukar poin': 'Kak bisa tukar poin di menu **Tukar Poin** di halaman Profil! Mulai dari voucher diskon 5%, gratis cup, sampai merchandise keren OkiruDrink 🎁 Minimum 30 poin sudah bisa ditukar lho!',
  'produk baru': 'Hai kak! 🌿 Kami terus menghadirkan varian baru setiap bulannya. Pantau terus notifikasi aplikasi ya, atau cek halaman **Menu** untuk melihat produk terbaru!',
  'jam operasional': '⏰ Jam operasional outlet OkiruDrink:\n• Senin – Jumat: 08.00 – 20.00 WIB\n• Sabtu – Minggu: 09.00 – 21.00 WIB\n\nCS Online: 08.00 – 22.00 WIB setiap hari 🙌',
  'batalkan pesanan': 'Untuk pembatalan pesanan, mohon hubungi kami dalam 10 menit setelah pesanan dibuat ya kak 🙏 Setelah itu pesanan sudah masuk proses produksi dan tidak bisa dibatalkan.',
  'default': 'Terima kasih sudah menghubungi OkiruDrink! 😊 Pesan kakak sudah kami terima dan akan segera ditangani oleh tim kami. Estimasi respons: **1-5 menit**. Ada lagi yang bisa kami bantu?',
}

function getAutoReply(text) {
  const lower = text.toLowerCase()
  for (const [key, val] of Object.entries(AUTO_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return val
  }
  return AUTO_RESPONSES.default
}

export default function LiveChatPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'cs',
      text: `Halo **${user?.name || 'Kak'}**! 👋 Selamat datang di OkiruDrink Live Chat. Saya siap membantu kamu. Ada yang bisa kami bantu hari ini?`,
      time: new Date(),
      status: 'delivered',
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuick, setShowQuick] = useState(true)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: text.trim(),
      time: new Date(),
      status: 'sent',
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowQuick(false)
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply = getAutoReply(text)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'cs',
        text: reply,
        time: new Date(),
        status: 'delivered',
      }])
    }, 1200 + Math.random() * 800)
  }

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  const renderText = (text) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    )

  return (
    <div className="livechat-page">
      {/* Header */}
      <div className="livechat-header">
        <button className="sub-back lc-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="lc-agent-info">
          <div className="lc-agent-avatar">{CS_AVATAR}</div>
          <div>
            <p className="lc-agent-name">{CS_NAME}</p>
            <div className="lc-online-badge">
              <span className="lc-online-dot" />
              Online
            </div>
          </div>
        </div>
        <button
          className="lc-call-btn"
          onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
          title="Hubungi via WhatsApp"
        >
          <Phone size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="livechat-messages">
        {/* Date separator */}
        <div className="lc-date-sep">Hari ini</div>

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`lc-msg-row ${msg.from === 'user' ? 'lc-msg-user' : 'lc-msg-cs'}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {msg.from === 'cs' && (
                <div className="lc-cs-avatar">{CS_AVATAR}</div>
              )}
              <div className={`lc-bubble ${msg.from === 'user' ? 'lc-bubble-user' : 'lc-bubble-cs'}`}>
                <p className="lc-bubble-text">{renderText(msg.text)}</p>
                <span className="lc-bubble-time">{formatTime(msg.time)}</span>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              key="typing"
              className="lc-msg-row lc-msg-cs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="lc-cs-avatar">{CS_AVATAR}</div>
              <div className="lc-bubble lc-bubble-cs lc-typing">
                <span /><span /><span />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Replies */}
        <AnimatePresence>
          {showQuick && !isTyping && (
            <motion.div
              className="lc-quick-replies"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="lc-quick-label">Pilih topik bantuan:</p>
              <div className="lc-quick-chips">
                {QUICK_REPLIES.map((q) => (
                  <motion.button
                    key={q}
                    className="lc-chip"
                    onClick={() => sendMessage(q)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} style={{ height: 8 }} />
      </div>

      {/* Input Area */}
      <div className="livechat-input-area">
        <div className="lc-input-wrap">
          <input
            ref={inputRef}
            className="lc-input"
            type="text"
            placeholder="Tulis pesanmu..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          />
          <motion.button
            className="lc-send-btn"
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={18} />
          </motion.button>
        </div>
        <p className="lc-disclaimer">Respons otomatis • Tim CS kami akan membalas segera 💬</p>
      </div>
    </div>
  )
}
