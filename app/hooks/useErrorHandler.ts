'use client'

import { useState, useCallback } from 'react'
import { useAccount, useChainId } from 'wagmi'

export interface AppError {
  type: 'wallet' | 'network' | 'transaction' | 'contract' | 'validation' | 'unknown'
  title: string
  message: string
  code?: string | number
  details?: string
  action?: {
    label: string
    handler: () => void
  }
}

const NETWORK_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  80001: 'Polygon Mumbai Testnet',
  97: 'BSC Testnet',
  11155111: 'Sepolia Testnet'
}

export function useErrorHandler() {
  const [currentError, setCurrentError] = useState<AppError | null>(null)
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const clearError = useCallback(() => {
    setCurrentError(null)
  }, [])

  const handleError = useCallback((error: any, context?: string): AppError => {
    console.error('Error occurred:', error, 'Context:', context)

    let appError: AppError

    // Wallet connection errors
    if (error?.code === 4001 || error?.message?.includes('rejected')) {
      appError = {
        type: 'wallet',
        title: 'Transaction Rejected',
        message: 'You rejected the transaction in your wallet.',
        code: error.code
      }
    } else if (error?.code === -32002 || error?.message?.includes('already pending')) {
      appError = {
        type: 'wallet',
        title: 'Pending Request',
        message: 'You have a pending request in your wallet. Please check your wallet and try again.',
        code: error.code
      }
    } else if (!isConnected) {
      appError = {
        type: 'wallet',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to continue.',
        action: {
          label: 'Connect Wallet',
          handler: () => {
            // This would trigger wallet connection
            console.log('Triggering wallet connection...')
          }
        }
      }
    } 
    // Network errors
    else if (error?.code === -32603 || error?.message?.includes('network')) {
      appError = {
        type: 'network',
        title: 'Network Error',
        message: 'There was a problem connecting to the blockchain network. Please check your connection and try again.',
        code: error.code
      }
    } else if (chainId && ![80001, 97].includes(chainId)) {
      appError = {
        type: 'network',
        title: 'Wrong Network',
        message: `Please switch to Mumbai Testnet or BSC Testnet. You're currently on ${NETWORK_NAMES[chainId] || 'Unknown Network'}.`,
        code: chainId,
        action: {
          label: 'Switch Network',
          handler: () => {
            console.log('Triggering network switch...')
          }
        }
      }
    }
    // Transaction errors
    else if (error?.code === 'INSUFFICIENT_FUNDS' || error?.message?.includes('insufficient funds')) {
      appError = {
        type: 'transaction',
        title: 'Insufficient Funds',
        message: 'You don\'t have enough funds to complete this transaction. Please check your balance.',
        code: error.code
      }
    } else if (error?.code === 'UNPREDICTABLE_GAS_LIMIT' || error?.message?.includes('gas')) {
      appError = {
        type: 'transaction',
        title: 'Gas Estimation Failed',
        message: 'Unable to estimate gas for this transaction. The transaction may fail or the contract may not exist.',
        code: error.code
      }
    } else if (error?.code === 'CALL_EXCEPTION' || error?.message?.includes('reverted')) {
      appError = {
        type: 'transaction',
        title: 'Transaction Failed',
        message: 'The transaction was reverted by the smart contract. Please check your parameters and try again.',
        code: error.code,
        details: error.reason || error.message
      }
    }
    // Contract errors
    else if (error?.code === 'INVALID_ADDRESS' || error?.message?.includes('invalid address')) {
      appError = {
        type: 'contract',
        title: 'Invalid Contract Address',
        message: 'The contract address provided is not valid. Please check and try again.',
        code: error.code
      }
    } else if (error?.code === 'CONTRACT_NOT_DEPLOYED' || error?.message?.includes('no code')) {
      appError = {
        type: 'contract',
        title: 'Contract Not Found',
        message: 'No contract found at this address. Please verify the address and network.',
        code: error.code
      }
    }
    // Validation errors
    else if (error?.message?.includes('validation')) {
      appError = {
        type: 'validation',
        title: 'Validation Error',
        message: error.message || 'Please check your input and try again.',
        code: error.code
      }
    }
    // Unknown errors
    else {
      appError = {
        type: 'unknown',
        title: 'Unexpected Error',
        message: error?.message || 'An unexpected error occurred. Please try again.',
        code: error?.code,
        details: JSON.stringify(error, null, 2)
      }
    }

    setCurrentError(appError)
    return appError
  }, [isConnected, chainId])

  const validateTransaction = useCallback((params: {
    amount?: string
    address?: string
    balance?: number
    maxAmount?: number
  }): string | null => {
    const { amount, address, balance, maxAmount } = params

    if (!isConnected) {
      return 'Please connect your wallet first.'
    }

    if (chainId && ![80001, 97].includes(chainId)) {
      return `Please switch to a supported network. Current: ${NETWORK_NAMES[chainId] || 'Unknown'}`
    }

    if (amount) {
      const numAmount = parseFloat(amount)
      if (isNaN(numAmount) || numAmount <= 0) {
        return 'Please enter a valid amount.'
      }
      
      if (balance !== undefined && numAmount > balance) {
        return 'Insufficient balance for this transaction.'
      }
      
      if (maxAmount !== undefined && numAmount > maxAmount) {
        return `Amount cannot exceed ${maxAmount}.`
      }
    }

    if (address && !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return 'Please enter a valid Ethereum address.'
    }

    return null
  }, [isConnected, chainId])

  return {
    currentError,
    handleError,
    clearError,
    validateTransaction
  }
}
