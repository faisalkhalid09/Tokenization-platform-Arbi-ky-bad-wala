'use client'

import React from 'react'
import { TokenCreator } from './TokenCreator'
import { TokenPanel } from './TokenPanel'

export function TokenModule() {
  return (
    <div className="space-y-6">
      <TokenCreator />
      <TokenPanel />
    </div>
  )
}
