'use client'

import React from 'react'
import { ConnectWallet, NetworkStatus } from './ConnectWallet'
import { useAdminStore } from '@/stores/adminStore'
import { Settings, Users, BarChart3, Home } from 'lucide-react'

export function Header() {
  const { role, setRole } = useAdminStore()

  const toggleRole = () => {
    const newRole = role === 'user' ? 'admin' : 'user'
    setRole(newRole)
  }

  return (
    <header className="border-b border-yellow-500/20 glass-effect backdrop-blur-md relative z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 btn-golden rounded-xl flex items-center justify-center shimmer-gold shadow-lg">
                <BarChart3 size={20} className="text-black" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-golden-glow">Tokenization Platform</h1>
                <p className="text-xs text-gray-400">Premium Blockchain Solutions</p>
              </div>
            </div>
            
            {/* Network status */}
            <NetworkStatus />
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Role toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Role:</span>
              <button
                onClick={toggleRole}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  role === 'admin' 
                    ? 'btn-golden shadow-lg hover:shadow-xl hover:shadow-yellow-500/20' 
                    : 'btn-golden-outline hover:shadow-lg hover:shadow-yellow-500/20'
                }`}
              >
                {role === 'admin' ? (
                  <>
                    <Settings size={16} />
                    Admin Panel
                  </>
                ) : (
                  <>
                    <Users size={16} />
                    User View
                  </>
                )}
              </button>
            </div>

            {/* Wallet connection */}
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  )
}
