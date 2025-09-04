'use client'

import React, { useState, useMemo } from 'react'
import { ShoppingCart, TrendingUp, TrendingDown, DollarSign, Activity, Search, Wallet } from 'lucide-react'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { Analytics } from './AnalyticsFixed'
import marketplaceData from '@/data/listings.json'

interface TokenListing {
  id: string
  symbol: string
  name: string
  address: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  trend: number[]
  description: string
  totalSupply: string
}

export function Marketplace() {
  const { 
    balances, 
    usdBalance, 
    tradeHistory, 
    buyToken, 
    sellToken, 
    getTokenBalance,
    getTotalPortfolioValue,
    getPortfolioAllocation 
  } = usePortfolioStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedToken, setSelectedToken] = useState<TokenListing | null>(null)
  const [tradeAmount, setTradeAmount] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const listings = marketplaceData as TokenListing[]

  // Create price map for calculations
  const tokenPrices = useMemo(() => {
    const prices: Record<string, number> = {}
    listings.forEach(token => {
      prices[token.symbol] = token.price
    })
    return prices
  }, [listings])

  const totalPortfolioValue = getTotalPortfolioValue(tokenPrices)
  const portfolioAllocation = getPortfolioAllocation(tokenPrices)

  // Filter tokens based on search
  const filteredListings = useMemo(() => {
    if (!searchQuery) return listings
    return listings.filter(token => 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [listings, searchQuery])

  const handleTrade = (token: TokenListing, amount: number, type: 'buy' | 'sell') => {
    try {
      if (type === 'buy') {
        buyToken(token.symbol, token.name, amount, token.price)
        setNotification({
          type: 'success',
          message: `Successfully bought ${amount} ${token.symbol} for $${(amount * token.price).toFixed(2)}`
        })
      } else {
        sellToken(token.symbol, token.name, amount, token.price)
        setNotification({
          type: 'success', 
          message: `Successfully sold ${amount} ${token.symbol} for $${(amount * token.price).toFixed(2)}`
        })
      }
      
      setTradeAmount('')
      setSelectedToken(null)
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Trade failed'
      })
    }
  }

  const openTradeModal = (token: TokenListing, type: 'buy' | 'sell') => {
    setSelectedToken(token)
    setTradeType(type)
    setTradeAmount('')
  }

  const formatPrice = (price: number) => {
    return price < 1 ? price.toFixed(4) : price.toFixed(2)
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={20} />
          <h2 className="text-lg font-semibold">Portfolio Overview</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-xl font-bold">${totalPortfolioValue.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Available Cash</p>
            <p className="text-xl font-bold">${usdBalance.toFixed(2)}</p>
          </div>
        </div>

        {portfolioAllocation.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Holdings</h3>
            <div className="space-y-2">
              {portfolioAllocation.map((allocation) => (
                <div key={allocation.symbol} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{allocation.symbol}</span>
                  <div className="text-right">
                    <p className="font-medium">${allocation.value.toFixed(2)}</p>
                    <p className="text-muted-foreground">{allocation.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Token Marketplace */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <h2 className="text-lg font-semibold">Token Marketplace</h2>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring w-64"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredListings.map((token) => {
            const userBalance = getTokenBalance(token.symbol)
            
            return (
              <div key={token.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div>
                        <h3 className="font-semibold">{token.name}</h3>
                        <p className="text-sm text-muted-foreground">{token.symbol}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold">${formatPrice(token.price)}</p>
                        <div className={`text-sm flex items-center gap-1 ${
                          token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {token.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {formatChange(token.change24h)}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{token.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Market Cap:</span>
                        <p className="font-medium">${token.marketCap.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">24h Volume:</span>
                        <p className="font-medium">${token.volume24h.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Your Holdings:</span>
                        <p className="font-medium">{userBalance} {token.symbol}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex gap-2">
                    <button
                      onClick={() => openTradeModal(token, 'buy')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors btn-focus"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => openTradeModal(token, 'sell')}
                      disabled={userBalance === 0}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-focus"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Trades */}
      {tradeHistory.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} />
            <h2 className="text-lg font-semibold">Recent Trades</h2>
          </div>
          
          <div className="space-y-2">
            {tradeHistory.slice(0, 5).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-medium">{trade.amount} {trade.symbol}</p>
                    <p className="text-sm text-muted-foreground">@ ${formatPrice(trade.price)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">${trade.notional.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(trade.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {selectedToken && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedToken.symbol}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  max={tradeType === 'sell' ? getTokenBalance(selectedToken.symbol) : undefined}
                  className="w-full px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Price: ${formatPrice(selectedToken.price)} per {selectedToken.symbol}</p>
                <p>Total: ${(parseFloat(tradeAmount || '0') * selectedToken.price).toFixed(2)}</p>
                {tradeType === 'buy' && (
                  <p>Available: ${usdBalance.toFixed(2)}</p>
                )}
                {tradeType === 'sell' && (
                  <p>Holdings: {getTokenBalance(selectedToken.symbol)} {selectedToken.symbol}</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const amount = parseFloat(tradeAmount)
                    if (amount > 0) {
                      handleTrade(selectedToken, amount, tradeType)
                    }
                  }}
                  disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-focus"
                >
                  Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
                </button>
                <button
                  onClick={() => setSelectedToken(null)}
                  className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors btn-focus"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <Analytics />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg border z-50 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
