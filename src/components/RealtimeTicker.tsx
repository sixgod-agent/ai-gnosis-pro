import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Bell, Verified } from 'lucide-react'

const cities = ['广州', '深圳', '北京', '上海', '杭州', '成都', '武汉', '南京', '重庆', '西安', '苏州', '长沙']
const actions = [
  (group: string) => `验证了 AI 模型 ${group}组，匹配成功`,
  (group: string) => `${group}组预测数据已同步`,
  (group: string) => `完成了 ${group}组算力校准`,
  (group: string) => `确认 ${group}组信号源接入`,
  (group: string) => `解锁了 ${group}组高频预测通道`,
  (group: string) => `${group}组量子加密校验通过`,
]

interface Message {
  id: number
  text: string
  time: string
  type: 'system' | 'user' | 'alert'
}

function generateMessage(group: string): Message {
  const city = cities[Math.floor(Math.random() * cities.length)]
  const phone = `1${Math.floor(30 + Math.random() * 69)}${Math.floor(10000000 + Math.random() * 90000000)}`
  const maskedPhone = `${phone.slice(0, 3)}***${phone.slice(-4)}`
  const actionFn = actions[Math.floor(Math.random() * actions.length)]

  const isSystem = Math.random() > 0.6
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  if (isSystem) {
    return {
      id: Date.now() + Math.random(),
      text: `[系统] ${city}节点算力波动 +${(Math.random() * 15).toFixed(1)}%，模型已自动调优`,
      time,
      type: 'system',
    }
  }

  return {
    id: Date.now() + Math.random(),
    text: `[用户] ${city}用户 ${maskedPhone} 刚刚${actionFn(group)}`,
    time,
    type: 'user',
  }
}

export default function RealtimeTicker({ group }: { group: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState({ online: 8742, verified: 23891 })
  const scrollRef = useRef<HTMLDivElement>(null)
  const msgIdRef = useRef(0)

  useEffect(() => {
    // Initial messages
    const initial: Message[] = Array.from({ length: 8 }, () => ({
      ...generateMessage(group),
      id: msgIdRef.current++,
    }))
    setMessages(initial)

    const timer = setInterval(() => {
      const newMsg = { ...generateMessage(group), id: msgIdRef.current++ }
      setMessages(prev => [...prev.slice(-15), newMsg])
      setStats(prev => ({
        online: Math.max(8000, prev.online + Math.floor((Math.random() - 0.45) * 50)),
        verified: prev.verified + Math.floor(Math.random() * 5),
      }))
    }, 3000 + Math.random() * 4000)

    return () => clearInterval(timer)
  }, [group])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass-card rounded-xl p-4 flex flex-col h-full min-h-[500px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-neon-green" />
          <h2 className="text-sm font-bold text-text-primary tracking-wide uppercase">
            实时播报 | Live Feed
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[10px] text-neon-green number-mono">LIVE</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-bg-tertiary/50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-text-secondary">在线节点</div>
          <div className="text-sm font-bold text-neon-green number-mono">
            {stats.online.toLocaleString()}
          </div>
        </div>
        <div className="bg-bg-tertiary/50 rounded-lg p-2 text-center">
          <div className="text-[9px] text-text-secondary">已验证用户</div>
          <div className="text-sm font-bold text-gold number-mono">
            {stats.verified.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg px-2.5 py-1.5 text-[11px] ${
              msg.type === 'system'
                ? 'bg-neon-green/5 border border-neon-green/10 text-neon-green/80'
                : 'bg-bg-tertiary/50 border border-border/30 text-text-secondary'
            }`}
          >
            <div className="flex items-start gap-1.5">
              {msg.type === 'user' ? (
                <Verified className="w-3 h-3 text-gold mt-0.5 flex-shrink-0" />
              ) : (
                <MessageSquare className="w-3 h-3 text-neon-green mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="break-all">{msg.text}</span>
                <div className="text-[8px] text-text-secondary/50 mt-0.5 number-mono text-right">
                  {msg.time}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
