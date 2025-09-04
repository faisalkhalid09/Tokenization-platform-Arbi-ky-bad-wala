'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, ArrowRight, FileText, Sparkles } from 'lucide-react'

interface LoadingScreenProps {
  onNavigateToApp: () => void
  onNavigateToDetails: () => void
}

export function LoadingScreen({ onNavigateToApp, onNavigateToDetails }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) return 100
        return prev + Math.random() * 15
      })
    }, 150)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-animated-gradient flex items-center justify-center relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-2xl mx-auto px-6">
        {isLoading ? (
          // Loading state
          <div className="space-y-8 animate-fade-in">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 btn-golden rounded-2xl flex items-center justify-center shimmer-gold shadow-2xl hover:shadow-yellow-500/30 transition-shadow duration-1000">
                  <BarChart3 size={48} className="text-black" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl opacity-20 blur animate-pulse"></div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="text-golden-glow">Blockchain</span>
                <br />
                <span className="text-white">Tokenization Platform</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg mx-auto">
                Premium blockchain solutions for ERC-20 token creation and management
              </p>
            </div>

            {/* Loading progress */}
            <div className="w-full max-w-md mx-auto">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Initializing platform... {Math.min(Math.floor(loadingProgress), 100)}%
              </p>
            </div>

            {/* Loading dots */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-70"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          // Navigation state
          <div className="space-y-12 animate-slide-in">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <div className="relative group">
                <div className="w-28 h-28 btn-golden rounded-2xl flex items-center justify-center shimmer-gold shadow-2xl group-hover:shadow-yellow-500/40 transition-all duration-500 group-hover:scale-105">
                  <BarChart3 size={56} className="text-black" />
                </div>
                <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-golden-glow">Blockchain</span>
                <br />
                <span className="text-white">Tokenization</span>
                <br />
                <span className="text-golden">Platform</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                A comprehensive platform for creating, managing, and trading ERC-20 tokens 
                with advanced governance, analytics, and marketplace features
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="space-y-4">
              <button
                onClick={onNavigateToDetails}
                className="group w-full max-w-md mx-auto flex items-center justify-center gap-4 px-8 py-4 btn-golden-outline rounded-xl text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25"
              >
                <FileText size={24} />
                <span>See All Project Details</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={onNavigateToApp}
                className="group w-full max-w-md mx-auto flex items-center justify-center gap-4 px-8 py-4 btn-golden rounded-xl text-lg font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30"
              >
                <Sparkles size={24} />
                <span>Go to Web App</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Features preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="glass-effect p-4 rounded-lg text-center group hover:border-yellow-500/30 transition-colors duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 size={24} className="text-black" />
                </div>
                <h3 className="text-sm font-semibold text-golden mb-1">ERC-20 Tokens</h3>
                <p className="text-xs text-gray-400">Deploy and manage tokens</p>
              </div>

              <div className="glass-effect p-4 rounded-lg text-center group hover:border-yellow-500/30 transition-colors duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={24} className="text-black" />
                </div>
                <h3 className="text-sm font-semibold text-golden mb-1">Marketplace</h3>
                <p className="text-xs text-gray-400">Trade and manage portfolio</p>
              </div>

              <div className="glass-effect p-4 rounded-lg text-center group hover:border-yellow-500/30 transition-colors duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles size={24} className="text-black" />
                </div>
                <h3 className="text-sm font-semibold text-golden mb-1">Analytics</h3>
                <p className="text-xs text-gray-400">Advanced insights and charts</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
