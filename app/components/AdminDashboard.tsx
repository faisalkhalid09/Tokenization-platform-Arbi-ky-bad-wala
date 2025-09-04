'use client'

import React, { useState } from 'react'
import { useAdminStore } from '@/stores/adminStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { 
  Settings, 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Trash2, 
  Eye,
  Activity,
  DollarSign,
  BarChart3,
  FileText
} from 'lucide-react'

export function AdminDashboard() {
  const { 
    platformFee, 
    isKycEnabled, 
    maxTokenSupply, 
    blacklistedAddresses,
    auditLog,
    setPlatformFee,
    setKycEnabled,
    setMaxTokenSupply,
    addToBlacklist,
    removeFromBlacklist,
    addAuditEntry,
    clearAuditLog
  } = useAdminStore()
  
  const { clearPortfolio } = usePortfolioStore()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'users' | 'governance' | 'compliance'>('overview')
  const [newBlacklistAddress, setNewBlacklistAddress] = useState('')
  const [tempFee, setTempFee] = useState(platformFee.toString())
  const [tempSupply, setTempSupply] = useState(maxTokenSupply.toString())
  
  // Mock governance proposals
  const [proposals] = useState([
    {
      id: 1,
      title: 'Increase Platform Fee to 0.75%',
      description: 'Proposal to increase platform fee from 0.5% to 0.75% to fund platform development',
      status: 'pending',
      votes: { for: 12, against: 3 },
      threshold: 15
    },
    {
      id: 2,
      title: 'Add New Token Category',
      description: 'Allow tokenization of intellectual property assets',
      status: 'approved',
      votes: { for: 18, against: 2 },
      threshold: 15
    }
  ])

  const handleUpdateFee = () => {
    const newFee = parseFloat(tempFee)
    if (newFee >= 0 && newFee <= 10) {
      setPlatformFee(newFee)
    }
  }

  const handleUpdateSupply = () => {
    const newSupply = parseInt(tempSupply)
    if (newSupply > 0 && newSupply <= 10000000000) {
      setMaxTokenSupply(newSupply)
    }
  }

  const handleAddToBlacklist = () => {
    if (newBlacklistAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      addToBlacklist(newBlacklistAddress)
      setNewBlacklistAddress('')
    }
  }

  const handleRemoveFromBlacklist = (address: string) => {
    removeFromBlacklist(address)
  }

  const mockApproveProposal = (proposalId: number) => {
    addAuditEntry(
      'Proposal Approved',
      `Governance proposal #${proposalId} has been approved`,
      'Multi-Sig Admin'
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'governance', label: 'Governance', icon: Shield },
    { id: 'compliance', label: 'Compliance', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} className="text-purple-600" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Administrator</span>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-1 border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Platform Fee</span>
              </div>
              <p className="text-2xl font-bold">{platformFee}%</p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">KYC Status</span>
              </div>
              <p className="text-2xl font-bold">{isKycEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-purple-600" />
                <span className="text-sm font-medium text-muted-foreground">Max Supply</span>
              </div>
              <p className="text-2xl font-bold">{maxTokenSupply.toLocaleString()}</p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-red-600" />
                <span className="text-sm font-medium text-muted-foreground">Blacklisted</span>
              </div>
              <p className="text-2xl font-bold">{blacklistedAddresses.length}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={20} />
              <h2 className="text-lg font-semibold">Recent Admin Activity</h2>
            </div>
            
            <div className="space-y-2">
              {auditLog.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{entry.action}</p>
                    <p className="text-sm text-muted-foreground">{entry.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{entry.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {auditLog.length > 5 && (
              <button className="w-full mt-4 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors">
                View All Activity ({auditLog.length} total)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Platform Settings */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Platform Settings</h2>
            
            <div className="space-y-6">
              {/* Fee Settings */}
              <div className="space-y-3">
                <h3 className="font-medium">Platform Fee</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={tempFee}
                    onChange={(e) => setTempFee(e.target.value)}
                    min="0"
                    max="10"
                    step="0.1"
                    className="px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring w-24"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <button
                    onClick={handleUpdateFee}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors btn-focus"
                  >
                    Update Fee
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">Current: {platformFee}%</p>
              </div>

              {/* Supply Limit */}
              <div className="space-y-3">
                <h3 className="font-medium">Maximum Token Supply</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={tempSupply}
                    onChange={(e) => setTempSupply(e.target.value)}
                    min="1"
                    max="10000000000"
                    className="px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring w-32"
                  />
                  <button
                    onClick={handleUpdateSupply}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors btn-focus"
                  >
                    Update Limit
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">Current: {maxTokenSupply.toLocaleString()} tokens</p>
              </div>

              {/* KYC Toggle */}
              <div className="space-y-3">
                <h3 className="font-medium">KYC Requirements</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setKycEnabled(!isKycEnabled)}
                    className={`px-4 py-2 rounded transition-colors btn-focus ${
                      isKycEnabled 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isKycEnabled ? 'Disable KYC' : 'Enable KYC'}
                  </button>
                  <span className={`text-sm font-medium ${
                    isKycEnabled ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Currently {isKycEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Blacklist Management */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Address Blacklist</h2>
            
            <div className="space-y-4">
              {/* Add to Blacklist */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBlacklistAddress}
                  onChange={(e) => setNewBlacklistAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-3 py-2 border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleAddToBlacklist}
                  disabled={!newBlacklistAddress.match(/^0x[a-fA-F0-9]{40}$/)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-focus"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Blacklisted Addresses */}
              <div className="space-y-2">
                {blacklistedAddresses.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No addresses blacklisted</p>
                ) : (
                  blacklistedAddresses.map((address) => (
                    <div key={address} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <span className="font-mono text-sm">{address}</span>
                      <button
                        onClick={() => handleRemoveFromBlacklist(address)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove from blacklist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Governance Tab */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Multi-Sig Simulation */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Multi-Signature Governance</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-800">Multi-Sig Configuration</span>
                </div>
                <p className="text-sm text-blue-700">3 of 5 signatures required for governance actions</p>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Signers: Admin-1, Admin-2, Admin-3, Admin-4, Admin-5</p>
                </div>
              </div>

              {/* Mock Proposals */}
              <div>
                <h3 className="font-medium mb-3">Active Proposals</h3>
                <div className="space-y-3">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{proposal.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${
                          proposal.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{proposal.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">For: {proposal.votes.for}</span>
                          <span className="text-red-600 font-medium ml-4">Against: {proposal.votes.against}</span>
                          <span className="text-muted-foreground ml-4">Threshold: {proposal.threshold}</span>
                        </div>
                        {proposal.status === 'pending' && (
                          <button
                            onClick={() => mockApproveProposal(proposal.id)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors btn-focus"
                          >
                            Simulate Approval
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* KYC Status */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">KYC/AML Compliance</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={16} />
                  <span className="font-medium">KYC Provider Integration</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This is a demo environment. In production, this would integrate with KYC providers like Jumio, Onfido, or Sumsub.
                </p>
                <button 
                  disabled
                  className="px-4 py-2 bg-muted text-muted-foreground rounded cursor-not-allowed"
                >
                  Start KYC Process (Demo Mode)
                </button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Audit Trail</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All admin actions are logged for compliance and audit purposes.
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={clearAuditLog}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors btn-focus"
                  >
                    Clear Audit Log
                  </button>
                  <span className="text-sm text-muted-foreground self-center">
                    {auditLog.length} entries stored
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Actions */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Debug Actions</h2>
        <div className="flex gap-2">
          <button
            onClick={clearPortfolio}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors btn-focus"
          >
            Reset Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}
