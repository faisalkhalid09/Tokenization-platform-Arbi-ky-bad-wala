'use client'

import React from 'react'
import { AlertTriangle, X, Wifi, Wallet, AlertCircle, FileX, Shield } from 'lucide-react'
import { AppError } from '@/hooks/useErrorHandler'

interface ErrorAlertProps {
  error: AppError
  onClose: () => void
  onAction?: () => void
}

const ErrorIcon: React.FC<{ type: AppError['type'] }> = ({ type }) => {
  switch (type) {
    case 'wallet':
      return <Wallet size={20} />
    case 'network':
      return <Wifi size={20} />
    case 'transaction':
      return <AlertCircle size={20} />
    case 'contract':
      return <FileX size={20} />
    case 'validation':
      return <Shield size={20} />
    default:
      return <AlertTriangle size={20} />
  }
}

const ErrorColor: Record<AppError['type'], string> = {
  wallet: 'bg-blue-50 border-blue-200 text-blue-800',
  network: 'bg-orange-50 border-orange-200 text-orange-800',
  transaction: 'bg-red-50 border-red-200 text-red-800',
  contract: 'bg-purple-50 border-purple-200 text-purple-800',
  validation: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  unknown: 'bg-gray-50 border-gray-200 text-gray-800'
}

export function ErrorAlert({ error, onClose, onAction }: ErrorAlertProps) {
  return (
    <div className={`border rounded-lg p-4 ${ErrorColor[error.type]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            <ErrorIcon type={error.type} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-sm">
              {error.title}
            </h3>
            
            <p className="text-sm mt-1">
              {error.message}
            </p>
            
            {error.details && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer hover:underline">
                  Technical Details
                </summary>
                <pre className="text-xs mt-1 p-2 bg-black/10 rounded whitespace-pre-wrap font-mono">
                  {error.details}
                </pre>
              </details>
            )}
            
            {error.code && (
              <p className="text-xs mt-1 opacity-70">
                Error Code: {error.code}
              </p>
            )}
            
            {error.action && (
              <button
                onClick={() => {
                  error.action!.handler()
                  onAction?.()
                }}
                className="mt-3 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
              >
                {error.action.label}
              </button>
            )}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Close error"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Alternative compact version for notifications
export function ErrorNotification({ error, onClose, onAction }: ErrorAlertProps) {
  return (
    <div className={`fixed top-4 right-4 max-w-sm border rounded-lg p-4 shadow-lg z-50 ${ErrorColor[error.type]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            <ErrorIcon type={error.type} />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-sm">
              {error.title}
            </h3>
            <p className="text-sm mt-1">
              {error.message}
            </p>
            
            {error.action && (
              <button
                onClick={() => {
                  error.action!.handler()
                  onAction?.()
                }}
                className="mt-2 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
              >
                {error.action.label}
              </button>
            )}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
