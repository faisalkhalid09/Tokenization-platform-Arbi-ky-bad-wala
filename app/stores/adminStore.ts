import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuditLogEntry {
  id: string
  timestamp: string
  action: string
  details: string
  user: string
}

export interface AdminState {
  // Role management
  role: 'user' | 'admin'
  
  // Admin settings
  platformFee: number
  isKycEnabled: boolean
  maxTokenSupply: number
  
  // User blacklist
  blacklistedAddresses: string[]
  
  // Audit log
  auditLog: AuditLogEntry[]
  
  // Actions
  setRole: (role: 'user' | 'admin') => void
  setPlatformFee: (fee: number) => void
  setKycEnabled: (enabled: boolean) => void
  setMaxTokenSupply: (supply: number) => void
  addToBlacklist: (address: string) => void
  removeFromBlacklist: (address: string) => void
  addAuditEntry: (action: string, details: string, user?: string) => void
  clearAuditLog: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Initial state
      role: 'user',
      platformFee: 0.5,
      isKycEnabled: false,
      maxTokenSupply: 10000000,
      blacklistedAddresses: [],
      auditLog: [],

      // Actions
      setRole: (role) => {
        set({ role })
        get().addAuditEntry(
          'Role Changed',
          `Role switched to ${role}`,
          'System'
        )
      },

      setPlatformFee: (fee) => {
        const oldFee = get().platformFee
        set({ platformFee: fee })
        get().addAuditEntry(
          'Fee Updated',
          `Platform fee changed from ${oldFee}% to ${fee}%`,
          get().role === 'admin' ? 'Admin' : 'System'
        )
      },

      setKycEnabled: (enabled) => {
        set({ isKycEnabled: enabled })
        get().addAuditEntry(
          'KYC Setting Changed',
          `KYC ${enabled ? 'enabled' : 'disabled'}`,
          get().role === 'admin' ? 'Admin' : 'System'
        )
      },

      setMaxTokenSupply: (supply) => {
        const oldSupply = get().maxTokenSupply
        set({ maxTokenSupply: supply })
        get().addAuditEntry(
          'Supply Limit Updated',
          `Max token supply changed from ${oldSupply.toLocaleString()} to ${supply.toLocaleString()}`,
          get().role === 'admin' ? 'Admin' : 'System'
        )
      },

      addToBlacklist: (address) => {
        const blacklist = get().blacklistedAddresses
        if (!blacklist.includes(address.toLowerCase())) {
          set({ 
            blacklistedAddresses: [...blacklist, address.toLowerCase()] 
          })
          get().addAuditEntry(
            'Address Blacklisted',
            `Address ${address} added to blacklist`,
            get().role === 'admin' ? 'Admin' : 'System'
          )
        }
      },

      removeFromBlacklist: (address) => {
        const blacklist = get().blacklistedAddresses
        const filtered = blacklist.filter(addr => addr !== address.toLowerCase())
        set({ blacklistedAddresses: filtered })
        get().addAuditEntry(
          'Address Removed from Blacklist',
          `Address ${address} removed from blacklist`,
          get().role === 'admin' ? 'Admin' : 'System'
        )
      },

      addAuditEntry: (action, details, user = 'Unknown') => {
        const entry: AuditLogEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          action,
          details,
          user,
        }
        
        set(state => ({
          auditLog: [entry, ...state.auditLog].slice(0, 100) // Keep only last 100 entries
        }))
      },

      clearAuditLog: () => {
        set({ auditLog: [] })
        // Don't log the clearing of the audit log to avoid infinite recursion
      },
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        role: state.role,
        platformFee: state.platformFee,
        isKycEnabled: state.isKycEnabled,
        maxTokenSupply: state.maxTokenSupply,
        blacklistedAddresses: state.blacklistedAddresses,
        auditLog: state.auditLog,
      }),
    }
  )
)
