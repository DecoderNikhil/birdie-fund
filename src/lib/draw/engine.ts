import { Score, Draw, DrawEntry, PrizePoolBreakdown } from '@/types'

export const SUBSCRIPTION_PRICES = {
  monthly: 999,
  yearly: 8999,
}

export const PRIZE_POOL_CONTRIBUTION_MONTHLY = 3.00
export const CHARITY_MINIMUM_PERCENT = 10

export const PRIZE_DISTRIBUTION = {
  jackpot: 0.40,
  match4: 0.35,
  match3: 0.25,
}

export function calculatePrizePool(
  activeSubscriberCount: number,
  rolledOverJackpot: number = 0
): PrizePoolBreakdown {
  const totalPool = activeSubscriberCount * PRIZE_POOL_CONTRIBUTION_MONTHLY + rolledOverJackpot
  return {
    jackpot: parseFloat((totalPool * PRIZE_DISTRIBUTION.jackpot + rolledOverJackpot).toFixed(2)),
    match4: parseFloat((totalPool * PRIZE_DISTRIBUTION.match4).toFixed(2)),
    match3: parseFloat((totalPool * PRIZE_DISTRIBUTION.match3).toFixed(2)),
    totalPool: parseFloat(totalPool.toFixed(2)),
  }
}

export function runRandomDraw(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export function runAlgorithmicDraw(allScores: Score[]): number[] {
  const frequency: Record<number, number> = {}
  for (let i = 1; i <= 45; i++) frequency[i] = 1

  for (const score of allScores) {
    frequency[score.score] = (frequency[score.score] || 0) + 3
  }

  const pool: number[] = []
  for (const [num, weight] of Object.entries(frequency)) {
    for (let i = 0; i < weight; i++) pool.push(parseInt(num))
  }

  const drawn = new Set<number>()
  while (drawn.size < 5) {
    const pick = pool[Math.floor(Math.random() * pool.length)]
    drawn.add(pick)
  }
  return Array.from(drawn).sort((a, b) => a - b)
}

export function countMatches(userScores: number[], drawnNumbers: number[]): number {
  const drawnSet = new Set(drawnNumbers)
  return userScores.filter(score => drawnSet.has(score)).length
}

export function getMatchType(matchCount: number): '5-match' | '4-match' | '3-match' | null {
  if (matchCount === 5) return '5-match'
  if (matchCount === 4) return '4-match'
  if (matchCount === 3) return '3-match'
  return null
}

export function calculatePrizePerWinner(poolAmount: number, winnerCount: number): number {
  if (winnerCount === 0) return 0
  return parseFloat((poolAmount / winnerCount).toFixed(2))
}