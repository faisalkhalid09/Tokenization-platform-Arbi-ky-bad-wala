'use client'

import React, { useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from 'recharts'
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react'
import { usePortfolioStore } from '@/stores/portfolioStore'
import marketplaceData from '@/data/listings.json'

interface TokenListing {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  trend: number[]
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16']

export function Analytics() {
  const { 
    balances, 
    tradeHistory, 
    getTotalPortfolioValue,
    getPortfolioAllocation 
  } = usePortfolioStore()
  
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

  // Portfolio allocation chart data
  const pieData = portfolioAllocation.map((allocation, index) => ({
    name: allocation.symbol,
    value: allocation.value,
    percentage: allocation.percentage,
    color: COLORS[index % COLORS.length]
  }))

  // Token trend data for line chart (using the first token with holdings or default to DMT)
  const selectedToken = listings.find(token => balances[token.symbol] > 0) || listings[0]
  const trendData = selectedToken.trend.map((price, index) => ({
    time: `T-${selectedToken.trend.length - 1 - index}`,
    price: price,
    volume: Math.random() * 1000 + 500 // Mock volume data
  }))

  // Trading volume by token
  const volumeData = listings.slice(0, 6).map(token => ({
    symbol: token.symbol,
    volume: token.volume24h / 1000, // Convert to thousands
    price: token.price,
    holdings: balances[token.symbol] || 0
  }))

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} />
          <h2 className="text-lg font-semibold">Portfolio Analytics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            <p className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Active Holdings</p>
            <p className="text-2xl font-bold">{Object.keys(balances).filter(symbol => balances[symbol] > 0).length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-2xl font-bold">{tradeHistory.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation Pie Chart */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={20} />
            <h3 className="text-lg font-semibold">Portfolio Allocation</h3>
          </div>
          
          {pieData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <p>No portfolio data available</p>
            </div>
          )}
        </div>

        {/* Token Price Trend */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} />
            <h3 className="text-lg font-semibold">{selectedToken.name} Price Trend</h3>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Volume by Token */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} />
            <h3 className="text-lg font-semibold">24h Volume by Token</h3>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="symbol" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar 
                  dataKey="volume" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Holdings */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} />
            <h3 className="text-lg font-semibold">Current Holdings</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(balances).filter(([_, balance]) => balance > 0).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No holdings yet</p>
            ) : (
              Object.entries(balances)
                .filter(([_, balance]) => balance > 0)
                .map(([symbol, balance]) => {
                  const token = listings.find(t => t.symbol === symbol)
                  const value = balance * (tokenPrices[symbol] || 0)
                  return (
                    <div key={symbol} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{symbol}</p>
                        <p className="text-sm text-muted-foreground">{token?.name || 'Unknown Token'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{balance.toFixed(2)} {symbol}</p>
                        <p className="text-sm text-muted-foreground">${value.toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Best Performing</p>
            <p className="font-medium">{listings.reduce((best, token) => 
              token.change24h > best.change24h ? token : best, listings[0]
            ).symbol}</p>
            <p className="text-sm text-green-600">
              +{listings.reduce((best, token) => 
                token.change24h > best.change24h ? token : best, listings[0]
              ).change24h.toFixed(1)}%
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Worst Performing</p>
            <p className="font-medium">{listings.reduce((worst, token) => 
              token.change24h < worst.change24h ? token : worst, listings[0]
            ).symbol}</p>
            <p className="text-sm text-red-600">
              {listings.reduce((worst, token) => 
                token.change24h < worst.change24h ? token : worst, listings[0]
              ).change24h.toFixed(1)}%
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Most Traded</p>
            <p className="font-medium">{listings.reduce((highest, token) => 
              token.volume24h > highest.volume24h ? token : highest, listings[0]
            ).symbol}</p>
            <p className="text-sm text-muted-foreground">
              ${listings.reduce((highest, token) => 
                token.volume24h > highest.volume24h ? token : highest, listings[0]
              ).volume24h.toLocaleString()}
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Market Cap</p>
            <p className="font-medium">
              ${listings.reduce((sum, token) => sum + token.marketCap, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {listings.length} tokens
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
