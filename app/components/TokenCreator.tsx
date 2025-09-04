'use client'

import React, { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { Plus, AlertCircle, Info } from 'lucide-react'
import { getChainName, getFaucetUrl } from '@/lib/chains'

interface DeployedToken {
  address: string
  name: string
  symbol: string
  initialSupply: string
  txHash: string
  chainId: number
  timestamp: string
}

interface TokenCreatorProps {
  onTokenDeployed?: (token: DeployedToken) => void
}

export function TokenCreator({ onTokenDeployed }: TokenCreatorProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    initialSupply: '1000000'
  })
  
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<{
    status: 'idle' | 'deploying' | 'waiting' | 'success' | 'error'
    message: string
    txHash?: string
    contractAddress?: string
  }>({ status: 'idle', message: '' })

  const [deployedTokens, setDeployedTokens] = useState<DeployedToken[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deployedTokens')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Token name is required'
    if (!formData.symbol.trim()) return 'Token symbol is required'
    if (!formData.initialSupply.trim()) return 'Initial supply is required'
    
    const supply = parseFloat(formData.initialSupply)
    if (isNaN(supply) || supply <= 0) return 'Initial supply must be a positive number'
    if (supply > 1000000000) return 'Initial supply cannot exceed 1 billion tokens'
    
    if (formData.symbol.length > 10) return 'Symbol should be 10 characters or less'
    if (formData.name.length > 50) return 'Name should be 50 characters or less'
    
    return null
  }

  // For demo purposes, we'll show how deployment works
  const handleDeploy = () => {
    setDeploymentStatus({ 
      status: 'error', 
      message: 'Demo mode: Use the CLI command to deploy tokens. See README for instructions.' 
    })
  }

  const clearStatus = () => {
    setDeploymentStatus({ status: 'idle', message: '' })
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Plus size={20} />
        <h2 className="text-lg font-semibold">Create New Token</h2>
      </div>

      <div className="space-y-4">
        {/* Form Fields */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Token Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="My Token"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isDeploying}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Token Symbol
          </label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            placeholder="MTK"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isDeploying}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Initial Supply
          </label>
          <input
            type="number"
            name="initialSupply"
            value={formData.initialSupply}
            onChange={handleInputChange}
            placeholder="1000000"
            min="1"
            max="1000000000"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isDeploying}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Maximum: 1 billion tokens
          </p>
        </div>

        {/* Deploy Button */}
        <button
          onClick={handleDeploy}
          disabled={!isConnected || isDeploying}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-focus"
        >
          {isDeploying ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Plus size={16} />
              Deploy Token
            </>
          )}
        </button>

        {/* Status Messages */}
        {deploymentStatus.status !== 'idle' && (
          <div className={`p-4 rounded-lg border ${
            deploymentStatus.status === 'success' ? 'bg-green-50 border-green-200' :
            deploymentStatus.status === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-2">
              {deploymentStatus.status === 'success' && <CheckCircle size={16} className="text-green-600 mt-0.5" />}
              {deploymentStatus.status === 'error' && <AlertCircle size={16} className="text-red-600 mt-0.5" />}
              {(deploymentStatus.status === 'deploying' || deploymentStatus.status === 'waiting') && 
                <Loader2 size={16} className="text-blue-600 animate-spin mt-0.5" />
              }
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  deploymentStatus.status === 'success' ? 'text-green-800' :
                  deploymentStatus.status === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {deploymentStatus.message}
                </p>

                {deploymentStatus.txHash && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Transaction Hash: 
                      <a 
                        href={getTransactionUrl(chainId, deploymentStatus.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {deploymentStatus.txHash.slice(0, 10)}...{deploymentStatus.txHash.slice(-8)}
                        <ExternalLink size={12} />
                      </a>
                    </p>
                    
                    {deploymentStatus.contractAddress && (
                      <p className="text-xs text-muted-foreground">
                        Contract Address: 
                        <span className="ml-1 font-mono text-foreground">
                          {deploymentStatus.contractAddress.slice(0, 10)}...{deploymentStatus.contractAddress.slice(-8)}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {deploymentStatus.status !== 'deploying' && deploymentStatus.status !== 'waiting' && (
                  <button
                    onClick={clearStatus}
                    className="mt-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recently Deployed Tokens */}
        {deployedTokens.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Recently Deployed</h3>
            <div className="space-y-2">
              {deployedTokens.slice(-3).reverse().map((token) => (
                <div key={token.address} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <p className="text-sm font-medium">{token.name} ({token.symbol})</p>
                    <p className="text-xs text-muted-foreground">
                      {token.address.slice(0, 10)}...{token.address.slice(-8)} • {getChainName(token.chainId)}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(token.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
