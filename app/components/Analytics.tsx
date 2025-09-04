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

  // Recent trading activity (last 7 days simulation)
  const tradingActivity = useMemo(() => {
    const days = 7
    const data = []
    const now = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      const dayTrades = tradeHistory.filter(trade => {
        const tradeDate = new Date(trade.timestamp)
        return tradeDate.toDateString() === date.toDateString()
      })
      
      const buyVolume = dayTrades
        .filter(trade => trade.type === 'buy')
        .reduce((sum, trade) => sum + trade.notional, 0)
        
      const sellVolume = dayTrades
        .filter(trade => trade.type === 'sell')
        .reduce((sum, trade) => sum + trade.notional, 0)
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        buy: buyVolume,
        sell: sellVolume,
        net: buyVolume - sellVolume
      })
    }
    
    return data
  }, [tradeHistory])

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value.toFixed(2)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for line chart
  const LineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-green-600">
            Price: ${payload[0].value.toFixed(4)}
          </p>
          {payload[1] && (
            <p className="text-sm text-blue-600">
              Volume: {payload[1].value.toFixed(0)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className=\"space-y-6\">\n      {/* Analytics Header */}\n      <div className=\"bg-card border rounded-lg p-6\">\n        <div className=\"flex items-center gap-2 mb-4\">\n          <BarChart3 size={20} />\n          <h2 className=\"text-lg font-semibold\">Portfolio Analytics</h2>\n        </div>\n        \n        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n          <div className=\"text-center\">\n            <p className=\"text-sm text-muted-foreground\">Total Portfolio Value</p>\n            <p className=\"text-2xl font-bold\">${totalPortfolioValue.toFixed(2)}</p>\n          </div>\n          <div className=\"text-center\">\n            <p className=\"text-sm text-muted-foreground\">Active Holdings</p>\n            <p className=\"text-2xl font-bold\">{Object.keys(balances).filter(symbol => balances[symbol] > 0).length}</p>\n          </div>\n          <div className=\"text-center\">\n            <p className=\"text-sm text-muted-foreground\">Total Trades</p>\n            <p className=\"text-2xl font-bold\">{tradeHistory.length}</p>\n          </div>\n        </div>\n      </div>\n\n      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">\n        {/* Portfolio Allocation Pie Chart */}\n        <div className=\"bg-card border rounded-lg p-6\">\n          <div className=\"flex items-center gap-2 mb-4\">\n            <PieChartIcon size={20} />\n            <h3 className=\"text-lg font-semibold\">Portfolio Allocation</h3>\n          </div>\n          \n          {pieData.length > 0 ? (\n            <div className=\"h-80\">\n              <ResponsiveContainer width=\"100%\" height=\"100%\">\n                <PieChart>\n                  <Pie\n                    data={pieData}\n                    cx=\"50%\"\n                    cy=\"50%\"\n                    innerRadius={60}\n                    outerRadius={120}\n                    paddingAngle={2}\n                    dataKey=\"value\"\n                  >\n                    {pieData.map((entry, index) => (\n                      <Cell key={`cell-${index}`} fill={entry.color} />\n                    ))}\n                  </Pie>\n                  <Tooltip content={<PieTooltip />} />\n                  <Legend \n                    verticalAlign=\"bottom\" \n                    height={36}\n                    formatter={(value, entry: any) => (\n                      <span style={{ color: entry.color }}>{value}</span>\n                    )}\n                  />\n                </PieChart>\n              </ResponsiveContainer>\n            </div>\n          ) : (\n            <div className=\"h-80 flex items-center justify-center text-muted-foreground\">\n              <p>No portfolio data available</p>\n            </div>\n          )}\n        </div>\n\n        {/* Token Price Trend */}\n        <div className=\"bg-card border rounded-lg p-6\">\n          <div className=\"flex items-center gap-2 mb-4\">\n            <TrendingUp size={20} />\n            <h3 className=\"text-lg font-semibold\">{selectedToken.name} Price Trend</h3>\n          </div>\n          \n          <div className=\"h-80\">\n            <ResponsiveContainer width=\"100%\" height=\"100%\">\n              <LineChart data={trendData}>\n                <CartesianGrid strokeDasharray=\"3 3\" className=\"opacity-30\" />\n                <XAxis \n                  dataKey=\"time\" \n                  tick={{ fontSize: 12 }}\n                  tickLine={false}\n                  axisLine={false}\n                />\n                <YAxis \n                  tick={{ fontSize: 12 }}\n                  tickLine={false}\n                  axisLine={false}\n                  tickFormatter={(value) => `$${value.toFixed(3)}`}\n                />\n                <Tooltip content={<LineTooltip />} />\n                <Line \n                  type=\"monotone\" \n                  dataKey=\"price\" \n                  stroke=\"#3b82f6\" \n                  strokeWidth={2}\n                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}\n                  activeDot={{ r: 6, fill: '#3b82f6' }}\n                />\n              </LineChart>\n            </ResponsiveContainer>\n          </div>\n        </div>\n      </div>\n\n      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-6\">\n        {/* Trading Volume by Token */}\n        <div className=\"bg-card border rounded-lg p-6\">\n          <div className=\"flex items-center gap-2 mb-4\">\n            <BarChart3 size={20} />\n            <h3 className=\"text-lg font-semibold\">24h Volume by Token</h3>\n          </div>\n          \n          <div className=\"h-80\">\n            <ResponsiveContainer width=\"100%\" height=\"100%\">\n              <BarChart data={volumeData}>\n                <CartesianGrid strokeDasharray=\"3 3\" className=\"opacity-30\" />\n                <XAxis \n                  dataKey=\"symbol\" \n                  tick={{ fontSize: 12 }}\n                  tickLine={false}\n                  axisLine={false}\n                />\n                <YAxis \n                  tick={{ fontSize: 12 }}\n                  tickLine={false}\n                  axisLine={false}\n                  tickFormatter={(value) => `$${value}k`}\n                />\n                <Tooltip \n                  formatter={(value: number, name: string) => [\n                    `$${(value * 1000).toLocaleString()}`, \n                    '24h Volume'\n                  ]}\n                  labelStyle={{ color: '#000' }}\n                />\n                <Bar \n                  dataKey=\"volume\" \n                  fill=\"#10b981\"\n                  radius={[4, 4, 0, 0]}\n                />\n              </BarChart>\n            </ResponsiveContainer>\n          </div>\n        </div>\n\n        {/* Trading Activity */}\n        <div className=\"bg-card border rounded-lg p-6\">\n          <div className=\"flex items-center gap-2 mb-4\">\n            <Activity size={20} />\n            <h3 className=\"text-lg font-semibold\">Trading Activity (7 Days)</h3>\n          </div>\n          \n          <div className=\"h-80\">\n            <ResponsiveContainer width=\"100%\" height=\"100%\">\n              <BarChart data={tradingActivity}>\n                <CartesianGrid strokeDasharray=\"3 3\" className=\"opacity-30\" />\n                <XAxis \n                  dataKey=\"date\" \n                  tick={{ fontSize: 12 }}\n                  tickLine={false}\n                  axisLine={false}\n                />\n                <YAxis \n                  tick={{ fontSize: 12 }}\n                  tickLine={false}\n                  axisLine={false}\n                  tickFormatter={(value) => `$${value}`}\n                />\n                <Tooltip \n                  formatter={(value: number, name: string) => {\n                    const label = name === 'buy' ? 'Buy Volume' : name === 'sell' ? 'Sell Volume' : 'Net Flow'\n                    return [`$${value.toFixed(2)}`, label]\n                  }}\n                  labelStyle={{ color: '#000' }}\n                />\n                <Legend />\n                <Bar \n                  dataKey=\"buy\" \n                  name=\"Buy\"\n                  fill=\"#10b981\"\n                  radius={[2, 2, 0, 0]}\n                />\n                <Bar \n                  dataKey=\"sell\" \n                  name=\"Sell\"\n                  fill=\"#ef4444\"\n                  radius={[2, 2, 0, 0]}\n                />\n              </BarChart>\n            </ResponsiveContainer>\n          </div>\n        </div>\n      </div>\n\n      {/* Performance Metrics */}\n      <div className=\"bg-card border rounded-lg p-6\">\n        <h3 className=\"text-lg font-semibold mb-4\">Performance Metrics</h3>\n        \n        <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">\n          <div className=\"p-4 bg-muted/50 rounded-lg\">\n            <p className=\"text-sm text-muted-foreground\">Best Performing</p>\n            <p className=\"font-medium\">{listings.reduce((best, token) => \n              token.change24h > best.change24h ? token : best, listings[0]\n            ).symbol}</p>\n            <p className=\"text-sm text-green-600\">\n              +{listings.reduce((best, token) => \n                token.change24h > best.change24h ? token : best, listings[0]\n              ).change24h.toFixed(1)}%\n            </p>\n          </div>\n          \n          <div className=\"p-4 bg-muted/50 rounded-lg\">\n            <p className=\"text-sm text-muted-foreground\">Worst Performing</p>\n            <p className=\"font-medium\">{listings.reduce((worst, token) => \n              token.change24h < worst.change24h ? token : worst, listings[0]\n            ).symbol}</p>\n            <p className=\"text-sm text-red-600\">\n              {listings.reduce((worst, token) => \n                token.change24h < worst.change24h ? token : worst, listings[0]\n              ).change24h.toFixed(1)}%\n            </p>\n          </div>\n          \n          <div className=\"p-4 bg-muted/50 rounded-lg\">\n            <p className=\"text-sm text-muted-foreground\">Most Traded</p>\n            <p className=\"font-medium\">{listings.reduce((highest, token) => \n              token.volume24h > highest.volume24h ? token : highest, listings[0]\n            ).symbol}</p>\n            <p className=\"text-sm text-muted-foreground\">\n              ${listings.reduce((highest, token) => \n                token.volume24h > highest.volume24h ? token : highest, listings[0]\n              ).volume24h.toLocaleString()}\n            </p>\n          </div>\n          \n          <div className=\"p-4 bg-muted/50 rounded-lg\">\n            <p className=\"text-sm text-muted-foreground\">Total Market Cap</p>\n            <p className=\"font-medium\">\n              ${listings.reduce((sum, token) => sum + token.marketCap, 0).toLocaleString()}\n            </p>\n            <p className=\"text-sm text-muted-foreground\">\n              {listings.length} tokens\n            </p>\n          </div>\n        </div>\n      </div>\n    </div>\n  )\n}
