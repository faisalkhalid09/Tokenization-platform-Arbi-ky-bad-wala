import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TradeEvent {
  id: string
  type: 'buy' | 'sell'
  symbol: string
  tokenName: string
  amount: number
  price: number
  notional: number // amount * price
  timestamp: string
}

export interface PortfolioState {
  // Portfolio balances (symbol -> amount)
  balances: Record<string, number>
  
  // Trade history
  tradeHistory: TradeEvent[]
  
  // Mock USD balance for trading
  usdBalance: number
  
  // Actions
  buyToken: (symbol: string, tokenName: string, amount: number, price: number) => void
  sellToken: (symbol: string, tokenName: string, amount: number, price: number) => void
  getTokenBalance: (symbol: string) => number
  getTotalPortfolioValue: (tokenPrices: Record<string, number>) => number
  getPortfolioAllocation: (tokenPrices: Record<string, number>) => Array<{ symbol: string, value: number, percentage: number }>
  clearPortfolio: () => void
  addFunds: (amount: number) => void
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      // Initial state
      balances: {},
      tradeHistory: [],
      usdBalance: 10000, // Start with $10k mock balance

      // Actions
      buyToken: (symbol, tokenName, amount, price) => {
        const state = get()
        const notional = amount * price
        
        // Check if user has enough USD balance
        if (notional > state.usdBalance) {
          throw new Error('Insufficient USD balance')
        }

        // Create trade event
        const tradeEvent: TradeEvent = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'buy',
          symbol,
          tokenName,
          amount,
          price,
          notional,
          timestamp: new Date().toISOString(),
        }

        set(state => ({
          // Update balances
          balances: {
            ...state.balances,
            [symbol]: (state.balances[symbol] || 0) + amount
          },
          
          // Deduct USD balance
          usdBalance: state.usdBalance - notional,
          
          // Add to trade history
          tradeHistory: [tradeEvent, ...state.tradeHistory].slice(0, 100) // Keep last 100 trades
        }))
      },

      sellToken: (symbol, tokenName, amount, price) => {
        const state = get()
        const currentBalance = state.balances[symbol] || 0
        
        // Check if user has enough tokens
        if (amount > currentBalance) {
          throw new Error(`Insufficient ${symbol} balance`)
        }

        const notional = amount * price

        // Create trade event
        const tradeEvent: TradeEvent = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'sell',
          symbol,
          tokenName,
          amount,
          price,
          notional,
          timestamp: new Date().toISOString(),
        }

        set(state => ({
          // Update balances
          balances: {
            ...state.balances,
            [symbol]: Math.max(0, currentBalance - amount)
          },
          
          // Add USD balance
          usdBalance: state.usdBalance + notional,
          
          // Add to trade history
          tradeHistory: [tradeEvent, ...state.tradeHistory].slice(0, 100)
        }))
      },

      getTokenBalance: (symbol) => {
        return get().balances[symbol] || 0
      },

      getTotalPortfolioValue: (tokenPrices) => {
        const state = get()
        let totalValue = state.usdBalance
        
        Object.entries(state.balances).forEach(([symbol, balance]) => {
          const price = tokenPrices[symbol] || 0
          totalValue += balance * price
        })
        
        return totalValue
      },

      getPortfolioAllocation: (tokenPrices) => {
        const state = get()
        const totalValue = get().getTotalPortfolioValue(tokenPrices)
        
        if (totalValue === 0) return []

        const allocations: Array<{ symbol: string, value: number, percentage: number }> = []
        
        // Add USD allocation
        if (state.usdBalance > 0) {
          allocations.push({
            symbol: 'USD',
            value: state.usdBalance,
            percentage: (state.usdBalance / totalValue) * 100
          })
        }

        // Add token allocations
        Object.entries(state.balances).forEach(([symbol, balance]) => {
          if (balance > 0) {
            const price = tokenPrices[symbol] || 0
            const value = balance * price
            
            if (value > 0) {
              allocations.push({
                symbol,
                value,
                percentage: (value / totalValue) * 100
              })
            }
          }
        })

        return allocations.sort((a, b) => b.value - a.value)
      },

      clearPortfolio: () => {
        set({
          balances: {},
          tradeHistory: [],
          usdBalance: 10000
        })
      },

      addFunds: (amount) => {
        set(state => ({
          usdBalance: state.usdBalance + amount
        }))
      }
    }),
    {
      name: 'portfolio-store',
      partialize: (state) => ({
        balances: state.balances,
        tradeHistory: state.tradeHistory,
        usdBalance: state.usdBalance,
      }),
    }
  )
)
