'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { Coins, Loader2, CheckCircle, AlertCircle, ExternalLink, Flame, Send, Plus as PlusIcon } from 'lucide-react'
import { 
  readTokenInfo, 
  readTokenBalance, 
  mintTokens, 
  burnTokens, 
  transferTokens,
  waitForTransaction,
  validateAddress,
  TokenInfo,
  TokenBalance,
  formatTokenAmount
} from '@/lib/erc20'
import { getTransactionUrl, getChainName } from '@/lib/chains'
import { useAppError } from '@/providers/ErrorProvider'
import { ErrorAlert } from '@/components/ErrorAlert'

interface TransactionStatus {
  type: 'mint' | 'burn' | 'transfer' | 'idle'
  status: 'idle' | 'pending' | 'success' | 'error'
  message: string
  txHash?: string
}

export function TokenPanel() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { handleError, validateTransaction, error, clearError } = useAppError()
  
  const [tokenAddress, setTokenAddress] = useState(() => {
    return process.env.NEXT_PUBLIC_DEPLOYED_TOKEN_ADDRESS || ''
  })
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  
  const [mintAmount, setMintAmount] = useState('')
  const [mintAddress, setMintAddress] = useState('')
  const [burnAmount, setBurnAmount] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferAddress, setTransferAddress] = useState('')
  
  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    type: 'idle',
    status: 'idle',
    message: ''
  })

  // Load token info when address changes
  useEffect(() => {
    if (tokenAddress && validateAddress(tokenAddress) && chainId) {
      loadTokenInfo()
    } else {
      setTokenInfo(null)
      setTokenBalance(null)
      setIsOwner(false)
    }
  }, [tokenAddress, chainId])

  // Load balance when account changes
  useEffect(() => {
    if (tokenInfo && address && chainId) {
      loadTokenBalance()
    }
  }, [tokenInfo, address, chainId])

  const loadTokenInfo = async () => {
    if (!tokenAddress || !chainId) return
    
    setIsLoading(true)
    try {
      const info = await readTokenInfo(tokenAddress, chainId)
      setTokenInfo(info)
      
      // Check if current user is owner
      if (address) {
        setIsOwner(info.owner.toLowerCase() === address.toLowerCase())
      }
    } catch (error) {
      console.error('Failed to load token info:', error)
      setTokenInfo(null)
      setIsOwner(false)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTokenBalance = async () => {
    if (!tokenInfo || !address || !chainId) return
    
    setIsLoadingBalance(true)
    try {
      const balance = await readTokenBalance(tokenInfo.address, address, chainId)
      setTokenBalance(balance)
    } catch (error) {
      console.error('Failed to load balance:', error)
      setTokenBalance(null)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleMint = async () => {
    if (!tokenInfo || !isOwner || !mintAddress || !mintAmount || !chainId) return

    if (!validateAddress(mintAddress)) {
      setTxStatus({
        type: 'mint',
        status: 'error',
        message: 'Invalid address format'
      })
      return
    }

    try {
      setTxStatus({
        type: 'mint',
        status: 'pending',
        message: 'Minting tokens...'
      })

      const hash = await mintTokens(tokenInfo.address, mintAddress, mintAmount, chainId)
      
      setTxStatus({
        type: 'mint',
        status: 'pending',
        message: 'Waiting for confirmation...',
        txHash: hash
      })

      await waitForTransaction(hash, chainId)
      
      setTxStatus({
        type: 'mint',
        status: 'success',
        message: `Successfully minted ${mintAmount} tokens`,
        txHash: hash
      })

      // Reload balances
      loadTokenInfo()
      if (mintAddress.toLowerCase() === address?.toLowerCase()) {
        loadTokenBalance()
      }
      
      // Clear form
      setMintAmount('')
      setMintAddress('')

    } catch (error: any) {
      let errorMessage = 'Mint failed'
      if (error?.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user'
      } else if (error?.message?.includes('OwnableUnauthorizedAccount')) {
        errorMessage = 'Only the token owner can mint'
      } else if (error?.message) {
        errorMessage = error.message
      }

      setTxStatus({
        type: 'mint',
        status: 'error',
        message: errorMessage
      })
    }
  }

  const handleBurn = async () => {
    if (!tokenInfo || !burnAmount || !chainId || !tokenBalance) return

    const burnAmountFloat = parseFloat(burnAmount)
    const balanceFloat = parseFloat(tokenBalance.formatted)
    
    if (burnAmountFloat > balanceFloat) {
      setTxStatus({
        type: 'burn',
        status: 'error',
        message: 'Insufficient balance to burn'
      })
      return
    }

    try {
      setTxStatus({
        type: 'burn',
        status: 'pending',
        message: 'Burning tokens...'
      })

      const hash = await burnTokens(tokenInfo.address, burnAmount, tokenInfo.decimals, chainId)
      
      setTxStatus({
        type: 'burn',
        status: 'pending',
        message: 'Waiting for confirmation...',
        txHash: hash
      })

      await waitForTransaction(hash, chainId)
      
      setTxStatus({
        type: 'burn',
        status: 'success',
        message: `Successfully burned ${burnAmount} tokens`,
        txHash: hash
      })

      // Reload balances
      loadTokenInfo()
      loadTokenBalance()
      
      // Clear form
      setBurnAmount('')

    } catch (error: any) {
      let errorMessage = 'Burn failed'
      if (error?.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user'
      } else if (error?.message?.includes('ERC20InsufficientBalance')) {
        errorMessage = 'Insufficient balance'
      } else if (error?.message) {
        errorMessage = error.message
      }

      setTxStatus({
        type: 'burn',
        status: 'error',
        message: errorMessage
      })
    }
  }

  const handleTransfer = async () => {
    if (!tokenInfo || !transferAddress || !transferAmount || !chainId || !tokenBalance) return

    if (!validateAddress(transferAddress)) {
      setTxStatus({
        type: 'transfer',
        status: 'error',
        message: 'Invalid recipient address format'
      })
      return
    }

    const transferAmountFloat = parseFloat(transferAmount)
    const balanceFloat = parseFloat(tokenBalance.formatted)
    
    if (transferAmountFloat > balanceFloat) {
      setTxStatus({
        type: 'transfer',
        status: 'error',
        message: 'Insufficient balance to transfer'
      })
      return
    }

    try {
      setTxStatus({
        type: 'transfer',
        status: 'pending',
        message: 'Transferring tokens...'
      })

      const hash = await transferTokens(tokenInfo.address, transferAddress, transferAmount, tokenInfo.decimals, chainId)
      
      setTxStatus({
        type: 'transfer',
        status: 'pending',
        message: 'Waiting for confirmation...',
        txHash: hash
      })

      await waitForTransaction(hash, chainId)
      
      setTxStatus({
        type: 'transfer',
        status: 'success',
        message: `Successfully transferred ${transferAmount} tokens`,
        txHash: hash
      })

      // Reload balance
      loadTokenBalance()
      
      // Clear form
      setTransferAmount('')
      setTransferAddress('')

    } catch (error: any) {
      let errorMessage = 'Transfer failed'
      if (error?.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user'
      } else if (error?.message?.includes('ERC20InsufficientBalance')) {
        errorMessage = 'Insufficient balance'
      } else if (error?.message?.includes('ERC20InvalidReceiver')) {
        errorMessage = 'Invalid recipient address'
      } else if (error?.message) {
        errorMessage = error.message
      }

      setTxStatus({
        type: 'transfer',
        status: 'error',
        message: errorMessage
      })
    }
  }

  const clearStatus = () => {
    setTxStatus({ type: 'idle', status: 'idle', message: '' })
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Coins size={20} />
        <h2 className="text-lg font-semibold">Token Interactions</h2>
      </div>

      <div className="space-y-6">
        {/* Token Address Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Token Contract Address
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter an ERC-20 token contract address to interact with it
          </p>
        </div>

        {/* Token Information */}
        {isLoading ? (
          <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading token information...</span>
          </div>
        ) : tokenInfo ? (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{tokenInfo.name} ({tokenInfo.symbol})</h3>
              {isOwner && (
                <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
                  Owner
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Supply:</span>
                <p className="font-medium">
                  {formatTokenAmount(tokenInfo.totalSupply, tokenInfo.decimals)} {tokenInfo.symbol}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Decimals:</span>
                <p className="font-medium">{tokenInfo.decimals}</p>
              </div>
            </div>
            
            {/* User Balance */}
            {isConnected && (
              <div className="pt-2 border-t">
                <span className="text-muted-foreground text-sm">Your Balance:</span>
                {isLoadingBalance ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : tokenBalance ? (
                  <p className="font-medium">
                    {tokenBalance.formatted} {tokenInfo.symbol}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Unable to load balance</p>
                )}
              </div>
            )}
          </div>
        ) : tokenAddress && validateAddress(tokenAddress) ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={16} />
              <span className="text-sm">Unable to load token information. Please verify the contract address and network.</span>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        {tokenInfo && isConnected && (
          <div className="space-y-4">
            {/* Mint Section (Owner Only) */}
            {isOwner && (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <PlusIcon size={16} />
                  <h3 className="font-medium">Mint Tokens</h3>
                  <span className="text-xs text-muted-foreground">(Owner Only)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Recipient address"
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    className="px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className="px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <button
                  onClick={handleMint}
                  disabled={!mintAddress || !mintAmount || txStatus.status === 'pending'}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-focus"
                >
                  {txStatus.type === 'mint' && txStatus.status === 'pending' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <PlusIcon size={16} />
                      Mint Tokens
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Burn Section */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Flame size={16} />
                <h3 className="font-medium">Burn Tokens</h3>
              </div>
              <input
                type="number"
                placeholder="Amount to burn"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                max={tokenBalance?.formatted || '0'}
                className="w-full px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleBurn}
                disabled={!burnAmount || !tokenBalance || parseFloat(burnAmount) > parseFloat(tokenBalance.formatted) || txStatus.status === 'pending'}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-focus"
              >
                {txStatus.type === 'burn' && txStatus.status === 'pending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Burning...
                  </>
                ) : (
                  <>
                    <Flame size={16} />
                    Burn Tokens
                  </>
                )}
              </button>
            </div>

            {/* Transfer Section */}
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Send size={16} />
                <h3 className="font-medium">Transfer Tokens</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Recipient address"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className="px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  max={tokenBalance?.formatted || '0'}
                  className="px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={handleTransfer}
                disabled={!transferAddress || !transferAmount || !tokenBalance || parseFloat(transferAmount) > parseFloat(tokenBalance.formatted) || txStatus.status === 'pending'}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-focus"
              >
                {txStatus.type === 'transfer' && txStatus.status === 'pending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Transferring...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Transfer Tokens
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {txStatus.status !== 'idle' && (
          <div className={`p-4 rounded-lg border ${
            txStatus.status === 'success' ? 'bg-green-50 border-green-200' :
            txStatus.status === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-2">
              {txStatus.status === 'success' && <CheckCircle size={16} className="text-green-600 mt-0.5" />}
              {txStatus.status === 'error' && <AlertCircle size={16} className="text-red-600 mt-0.5" />}
              {txStatus.status === 'pending' && <Loader2 size={16} className="text-blue-600 animate-spin mt-0.5" />}
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  txStatus.status === 'success' ? 'text-green-800' :
                  txStatus.status === 'error' ? 'text-red-800' :
                  'text-blue-800'
                }`}>
                  {txStatus.message}
                </p>

                {txStatus.txHash && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Transaction: 
                    <a 
                      href={getTransactionUrl(chainId, txStatus.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {txStatus.txHash.slice(0, 10)}...{txStatus.txHash.slice(-8)}
                      <ExternalLink size={12} />
                    </a>
                  </p>
                )}

                {txStatus.status !== 'pending' && (
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

        {!isConnected && (
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Connect your wallet to interact with tokens
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
