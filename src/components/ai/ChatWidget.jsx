import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, Send, Loader, Sparkles, ShoppingCart, CheckCircle2 } from 'lucide-react'
import api from '../../lib/api'
import useCartStore from '../../store/cartStore'

const ChatWidget = () => {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your shopping assistant. Tell me what you're looking for and I can help you find it and add it to your cart." },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const sendMessage = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)

    try {
      const history = nextMessages
        .slice(0, -1)
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
      const response = await api.post('/ai/chat', { message: text, history })
      const reply = response.data?.reply || "Sorry, I didn't catch that - could you rephrase?"
      const actions = response.data?.actions || []

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

      // Execute any actions the assistant requested. Cart state lives
      // client-side, so this is where the actual mutation happens.
      for (const action of actions) {
        if (action.type === 'add_to_cart') {
          addItem(
            { _id: action.productId, name: action.name, price: action.price, image: action.image },
            action.quantity || 1
          )
          setMessages(prev => [...prev, {
            role: 'action',
            content: `Added "${action.name}" to your cart${action.quantity > 1 ? ` (x${action.quantity})` : ''}`,
          }])
        } else if (action.type === 'go_to_checkout') {
          setMessages(prev => [...prev, { role: 'action', content: 'Taking you to checkout...' }])
          setTimeout(() => navigate('/checkout'), 600)
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble right now. Please try again in a moment.",
      }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-3 w-[90vw] max-w-sm h-[28rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-primary-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-semibold">Shopping Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="hover:opacity-80">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => {
              if (m.role === 'action') {
                return (
                  <div key={i} className="flex justify-center">
                    <div className="flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-full px-3 py-1 text-xs font-medium">
                      {m.content.startsWith('Added') ? <ShoppingCart size={12} /> : <CheckCircle2 size={12} />}
                      {m.content}
                    </div>
                  </div>
                )
              }
              return (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-primary-700 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              )
            })}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl rounded-bl-sm px-3 py-2">
                  <Loader size={14} className="animate-spin text-primary-600" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-gray-200 p-2 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sizing, styles..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="bg-primary-700 text-white rounded-lg px-3 py-2 hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary-700 text-white shadow-xl flex items-center justify-center hover:bg-primary-800 transition-colors"
        aria-label={isOpen ? 'Close shopping assistant' : 'Open shopping assistant'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}

export default ChatWidget
