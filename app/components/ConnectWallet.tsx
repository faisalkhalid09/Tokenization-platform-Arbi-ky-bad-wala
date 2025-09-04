'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { Wallet, ChevronDown, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react'
import { getChainById, getChainName, isChainSupported, getDefaultChain } from '@/lib/chains'
import { supportedChains } from '@/lib/chains'

interface ConnectWalletProps {
  className?: string
}

export function ConnectWallet({ className = '' }: ConnectWalletProps) {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, error: connectError, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitchPending } = useSwitchChain()

  const [isClient, setIsClient] = useState(false)
  const [showNetworkMenu, setShowNetworkMenu] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
    
    // Check if MetaMask is installed
    if (typeof window !== 'undefined') {
      const isInstalled = typeof window.ethereum !== 'undefined'
      setIsMetaMaskInstalled(isInstalled)
    }
  }, [])

  // Auto-connect to default network if connected but on unsupported network
  useEffect(() => {
    if (isConnected && chainId && !isChainSupported(chainId)) {
      const defaultChain = getDefaultChain()
      switchChain({ chainId: defaultChain.id })
    }
  }, [isConnected, chainId, switchChain])

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    try {
      await connect({ connector: metaMask() })
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setShowNetworkMenu(false)
  }

  const handleNetworkSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId })
      setShowNetworkMenu(false)
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const currentChain = chainId ? getChainById(chainId) : null
  const isWrongNetwork = chainId && !isChainSupported(chainId)

  // Don't render on server side
  if (!isClient) {
    return (
      <div className={`animate-pulse bg-muted rounded-lg h-10 w-32 ${className}`} />
    )
  }

  if (!isMetaMaskInstalled) {
    return (
      <button
        onClick={handleConnect}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors btn-focus ${className}`}
      >
        <Wallet size={16} />
        Install MetaMask
      </button>
    )
  }

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnectPending || isConnecting}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors btn-focus disabled:opacity-50 ${className}`}
      >
        <Wallet size={16} />
        {isConnectPending || isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Wrong Network Banner */}
      {isWrongNetwork && (
        <div className="absolute -top-12 right-0 left-0 bg-red-50 border border-red-200 rounded-lg p-3 mb-2 z-10">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <AlertTriangle size={16} />
            <span>Wrong network. Please switch to a supported testnet.</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Network Selector */}
        <div className="relative">
          <button
            onClick={() => setShowNetworkMenu(!showNetworkMenu)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors btn-focus ${
              isWrongNetwork 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-card border-border hover:bg-accent'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              isWrongNetwork ? 'network-disconnected' : 'network-connected'
            }`} />
            <span className="text-sm font-medium">
              {currentChain?.name || 'Unknown'}
            </span>
            <ChevronDown size={14} />
          </button>

          {showNetworkMenu && (
            <div className="absolute top-full mt-1 right-0 bg-popover border border-border rounded-lg shadow-lg py-1 z-20 min-w-48">
              {supportedChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleNetworkSwitch(chain.id)}
                  disabled={isSwitchPending}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      chainId === chain.id ? 'network-connected' : 'bg-muted-foreground'
                    }`} />
                    <span>{chain.name}</span>
                  </div>
                  {chainId === chain.id && <CheckCircle size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm font-medium">
            {formatAddress(address || '')}
          </span>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={handleDisconnect}
          className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors btn-focus"
        >
          Disconnect
        </button>
      </div>

      {/* Connection Error */}
      {connectError && (
        <div className="absolute top-full mt-2 right-0 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 max-w-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>Connection failed: {connectError.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Network status indicator component
export function NetworkStatus() {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !isConnected) return null

  const currentChain = getChainById(chainId)
  const isSupported = isChainSupported(chainId)

  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
      isSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full ${
        isSupported ? 'network-connected' : 'network-disconnected'
      }`} />
      <span>{getChainName(chainId)}</span>
      {currentChain?.testnet && (
        <span className="text-xs opacity-75">(Testnet)</span>
      )}
    </div>
  )
}
