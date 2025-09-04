'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { TokenModule } from '@/components/TokenModule'
import { Marketplace } from '@/components/Marketplace'
import { AdminDashboard } from '@/components/AdminDashboard'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ProjectDetails } from '@/components/ProjectDetails'
import { useAdminStore } from '@/stores/adminStore'

type AppState = 'loading' | 'details' | 'app'

export default function HomePage() {
  const { role } = useAdminStore()
  const [appState, setAppState] = useState<AppState>(() => {
    // Check if user has seen the loading screen before
    if (typeof window !== 'undefined') {
      const hasSeenIntro = localStorage.getItem('hasSeenIntro')
      return hasSeenIntro ? 'app' : 'loading'
    }
    return 'loading'
  })

  const handleNavigateToApp = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenIntro', 'true')
    }
    setAppState('app')
  }

  const handleNavigateToDetails = () => {
    setAppState('details')
  }

  // Loading screen component
  if (appState === 'loading') {
    return (
      <LoadingScreen 
        onNavigateToApp={handleNavigateToApp}
        onNavigateToDetails={handleNavigateToDetails}
      />
    )
  }

  // Project details component
  if (appState === 'details') {
    return (
      <ProjectDetails onNavigateToApp={handleNavigateToApp} />
    )
  }

  // Main application
  return (
    <div className="min-h-screen bg-animated-gradient">
      {/* Golden particles background effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-yellow-500 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-amber-400 rounded-full pulse-golden opacity-20"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-25"></div>
      </div>

      {/* Header with wallet connection */}
      <Header />

      {/* Hero section */}
      <div className="relative py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-golden-glow">Blockchain</span>{' '}
            <span className="text-white">Tokenization</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create, manage, and trade ERC-20 tokens with our premium blockchain platform
          </p>
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-400"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full pulse-golden"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-400"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 pb-8">
        {role === 'admin' ? (
          // Admin view
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-golden mb-2">Admin Dashboard</h2>
              <p className="text-gray-400">Manage your tokenization platform</p>
            </div>
            <AdminDashboard />
          </div>
        ) : (
          // User view - enhanced two column layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Token operations */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-golden mb-1">Token Operations</h2>
                <p className="text-gray-400 text-sm">Create and manage your tokens</p>
              </div>
              <TokenModule />
            </div>

            {/* Right column - Marketplace */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-golden mb-1">Marketplace</h2>
                <p className="text-gray-400 text-sm">Discover and trade tokens</p>
              </div>
              <Marketplace />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-yellow-500/20 mt-16 py-8 glass-effect">
        <div className="container mx-auto px-4 text-center text-sm">
          <p className="text-gray-300">
            <span className="text-golden">Blockchain Tokenization Platform</span> - Premium Demo Application
          </p>
          <p className="mt-2 text-gray-400">
            Built with <span className="text-yellow-400">Next.js</span>, <span className="text-yellow-400">Hardhat</span>, and <span className="text-yellow-400">Tailwind CSS</span>
          </p>
          <div className="mt-4 space-x-4">
            <span className="status-success px-3 py-1.5 rounded-full text-xs font-medium">
              🟢 Testnet Only
            </span>
            <span className="status-pending px-3 py-1.5 rounded-full text-xs font-medium">
              ⚡ Demo Version
            </span>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-400/50"></div>
            <div className="w-1 h-1 bg-yellow-400/50 rounded-full"></div>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-400/50"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
