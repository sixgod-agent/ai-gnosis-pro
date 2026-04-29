import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ChevronDown, Cpu, Layers, Zap, Database } from 'lucide-react'

const modelDetails = [
  {
    icon: Brain,
    title: 'LSTM-Transformer 混合架构',
    desc: '采用双层 LSTM 编码器捕获时序依赖，结合 12 层 Transformer 自注意力机制提取跨期特征映射，实现长短期记忆融合预测。',
    tag: '核心模型',
  },
  {
    icon: Cpu,
    title: '量子贝叶斯推理引擎 v5.0',
    desc: '基于量子退火算法优化的贝叶斯网络，在 10^18 维参数空间中搜索最优后验分布，实现概率推断精度提升 340%。',
    tag: '推理层',
  },
  {
    icon: Layers,
    title: '马尔可夫链状态转移矩阵',
    desc: '构建 49×49 维状态转移概率矩阵，融合历史 5000+ 期数据训练，捕获号码间隐含的转移规律与周期性模式。',
    tag: '特征工程',
  },
  {
    icon: Zap,
    title: '实时波动率捕捉模块',
    desc: '基于高频数据流的自适应波动率估计，结合 GARCH(1,1) 模型与隐含波动率曲面，动态调整预测置信区间。',
    tag: '风控模块',
  },
  {
    icon: Database,
    title: '多维特征向量空间',
    desc: '包含 128 维技术指标特征、64 维统计分布特征、32 维周期性特征，共计 224 维输入向量，经 PCA 降维至 48 维后输入模型。',
    tag: '数据管道',
  },
]

export default function ModelInfo() {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3 text-left hover:bg-bg-tertiary/20 transition-colors"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Brain className="w-3.5 h-3.5 text-neon-green" />
          <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
            AI 模型原理 | Model Architecture
          </h2>
          <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/20">
            v5.0
          </span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 sm:px-5 sm:pb-4 space-y-2 sm:space-y-2.5 border-t border-border/30 pt-3">
              <p className="text-[9px] sm:text-[10px] text-text-secondary leading-relaxed">
                AI-Gnosis Pro v5.0 采用多模型融合架构，通过量子增强计算实现高维概率空间搜索。
                以下为核心技术模块说明：
              </p>

              {modelDetails.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-lg bg-bg-tertiary/30 border border-border/30 p-2 sm:p-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-neon-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neon-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] sm:text-xs font-bold text-text-primary">{item.title}</span>
                          <span className="text-[7px] sm:text-[8px] px-1 py-0.5 rounded bg-gold/10 text-gold/70">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              <div className="p-2 rounded-lg bg-gold/5 border border-gold/10">
                <div className="text-[8px] sm:text-[9px] text-gold/70 text-center">
                  以上模型架构基于 2026 马年周期优化 | 模型参数量 2.4B | 训练数据跨度 15 年 | 推理延迟 &lt; 200ms
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
