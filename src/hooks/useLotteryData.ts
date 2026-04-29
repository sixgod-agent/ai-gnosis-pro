import { useMemo } from 'react'
import raw from '../data/lotteryData.json'
import { parseDrawRecord, getNextExpect } from '../lib/lotteryData'
import type { DrawRecord } from '../lib/lotteryData'

interface LotteryAPIResponse {
  server_time: string
  lottery_data: Array<{
    code: string
    expect: string
    openCode: string
    zodiac?: string
    wave?: string
    openTime: string
    status: string
    history: Array<{
      expect: string
      openCode: string
      openTime: string
    }>
  }>
}

export interface LotteryDataContext {
  latestDraw: DrawRecord
  history: DrawRecord[]
  nextExpect: string
  serverTime: string
  lastUpdate: string
}

export function useLotteryData(): LotteryDataContext {
  return useMemo(() => {
    const data = raw as unknown as LotteryAPIResponse
    const hk = data.lottery_data.find(d => d.code === 'hk')
    if (!hk) {
      throw new Error('HK lottery data not found')
    }

    const latestDraw = parseDrawRecord({
      expect: hk.expect,
      openCode: hk.openCode,
      openTime: hk.openTime,
      zodiac: hk.zodiac,
      wave: hk.wave,
    })

    // Parse history - these lack zodiac/wave from API, we compute them
    const history = hk.history.map(h => parseDrawRecord(h))

    return {
      latestDraw,
      history,
      nextExpect: getNextExpect(hk.expect),
      serverTime: data.server_time,
      lastUpdate: data.server_time,
    }
  }, [])
}
