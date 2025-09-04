'use client'

import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react'
import { AppError, useErrorHandler } from '@/hooks/useErrorHandler'
import { ErrorNotification } from '@/components/ErrorAlert'

interface ErrorContextType {
  handleError: (error: any, context?: string) => AppError
  showError: (error: AppError) => void
  hideError: () => void
  clearError: () => void
  validateTransaction: (params: {
    amount?: string
    address?: string
    balance?: number
    maxAmount?: number
  }) => string | null
  error: AppError | null
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

interface ErrorProviderProps {
  children: ReactNode
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const { currentError, handleError, clearError, validateTransaction } = useErrorHandler()
  const [visibleError, setVisibleError] = useState<AppError | null>(null)

  const showError = useCallback((error: AppError) => {
    setVisibleError(error)
    
    // Auto-hide error after 6 seconds unless it has an action
    if (!error.action) {
      setTimeout(() => {
        setVisibleError((current) => {
          // Only hide if it's still the same error
          return current === error ? null : current
        })
      }, 6000)
    }
  }, [])

  const hideError = useCallback(() => {
    setVisibleError(null)
  }, [])

  // Wrap handleError to automatically show the error
  const handleAndShowError = useCallback((error: any, context?: string) => {
    const appError = handleError(error, context)
    showError(appError)
    return appError
  }, [handleError, showError])

  const value = {
    handleError: handleAndShowError,
    showError,
    hideError,
    clearError,
    validateTransaction,
    error: visibleError || currentError
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
      {visibleError && (
        <ErrorNotification 
          error={visibleError} 
          onClose={hideError}
          onAction={hideError}
        />
      )}
    </ErrorContext.Provider>
  )
}

export function useAppError() {
  const context = useContext(ErrorContext)
  
  if (context === undefined) {
    throw new Error('useAppError must be used within an ErrorProvider')
  }
  
  return context
}
