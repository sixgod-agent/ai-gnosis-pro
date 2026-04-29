import { useState, useEffect, useCallback } from 'react'

export function useAnimatedValue(
  target: number,
  speed: number = 1,
  decimals: number = 1
): number {
  const [value, setValue] = useState(target)

  useEffect(() => {
    const timer = setInterval(() => {
      setValue(prev => {
        const diff = target - prev
        if (Math.abs(diff) < 0.01) return target
        return prev + diff * 0.05 * speed
      })
    }, 30)
    return () => clearInterval(timer)
  }, [target, speed])

  return Number(value.toFixed(decimals))
}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useCallback(callback, [callback])

  useEffect(() => {
    if (delay === null) return
    const timer = setInterval(savedCallback, delay)
    return () => clearInterval(timer)
  }, [savedCallback, delay])
}
