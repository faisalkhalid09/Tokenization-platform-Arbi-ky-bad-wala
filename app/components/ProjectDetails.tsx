'use client'

import React, { useState } from 'react'
import { 
  ArrowRight, 
  Code2, 
  Shield, 
  Layers, 
  Database, 
  Globe, 
  Smartphone,
  BarChart3,
  Wallet,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

interface ProjectDetailsProps {
  onNavigateToApp: () => void
}

export function ProjectDetails({ onNavigateToApp }: ProjectDetailsProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview'])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const Section = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string
    title: string
    icon: React.ComponentType<{ size: number }>
    children: React.ReactNode 
  }) => {
    const isExpanded = expandedSections.includes(id)
    
    return (
      <div className="card-premium rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-yellow-500/5 transition-colors duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
              <Icon size={18} className="text-black" />
            </div>
            <h2 className="text-xl font-semibold text-golden">{title}</h2>
          </div>
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6 animate-slide-in">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-animated-gradient">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 btn-golden rounded-2xl flex items-center justify-center shimmer-gold shadow-2xl">
              <BarChart3 size={40} className="text-black" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-golden-glow">Blockchain Tokenization Platform</span>
            <br />
            <span className="text-white text-2xl md:text-3xl">Project Technical Overview</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete technical documentation of a comprehensive ERC-20 tokenization platform 
            with advanced trading, governance, and analytics capabilities
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Project Overview */}
          <Section id="overview" title="Project Overview" icon={Globe}>
            <div className="space-y-6 text-gray-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-golden mb-3">What This Platform Does</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Deploy ERC-20 tokens directly from your browser with one click</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Manage token operations: mint, burn, and transfer with owner controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Simulate trading in a full-featured marketplace with portfolio tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Access advanced analytics with interactive charts and insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Utilize governance features with role-based admin dashboard</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-golden mb-3">Key Achievements</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Production-ready codebase with comprehensive error handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Multi-network support for Polygon Mumbai and BSC testnets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Mobile-responsive design with modern UI/UX principles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Security-first approach with OpenZeppelin libraries</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* Technology Stack */}
          <Section id="tech-stack" title="Technology Stack" icon={Code2}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-effect p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-3 flex items-center gap-2">
                  <Layers size={18} />
                  Frontend
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>Next.js 14:</strong> Modern React framework with App Router</li>
                  <li><strong>TypeScript:</strong> Type-safe development</li>
                  <li><strong>Tailwind CSS:</strong> Utility-first styling framework</li>
                  <li><strong>Wagmi & Viem:</strong> React hooks for Ethereum</li>
                  <li><strong>Zustand:</strong> Lightweight state management</li>
                  <li><strong>Recharts:</strong> Interactive data visualizations</li>
                  <li><strong>Lucide React:</strong> Beautiful icon library</li>
                </ul>
              </div>

              <div className="glass-effect p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-3 flex items-center gap-2">
                  <Shield size={18} />
                  Blockchain
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>Solidity ^0.8.20:</strong> Smart contract language</li>
                  <li><strong>OpenZeppelin:</strong> Audited security libraries</li>
                  <li><strong>Hardhat:</strong> Development environment</li>
                  <li><strong>Ethers.js:</strong> Blockchain interaction library</li>
                  <li><strong>ERC-20 Standard:</strong> Token implementation</li>
                  <li><strong>MetaMask:</strong> Wallet integration</li>
                </ul>
              </div>

              <div className="glass-effect p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-3 flex items-center gap-2">
                  <Database size={18} />
                  Development
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><strong>Node.js 18+:</strong> Runtime environment</li>
                  <li><strong>npm Workspaces:</strong> Monorepo management</li>
                  <li><strong>ESLint:</strong> Code quality and consistency</li>
                  <li><strong>Railway:</strong> Cloud deployment platform</li>
                  <li><strong>Docker:</strong> Containerization support</li>
                  <li><strong>Git:</strong> Version control</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Smart Contract Features */}
          <Section id="smart-contracts" title="Smart Contract Architecture" icon={Shield}>
            <div className="space-y-6">
              <div className="glass-effect p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-4">MyToken.sol - ERC-20 Implementation</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Core Features</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• Standard ERC-20 token functionality</li>
                      <li>• Owner-only minting capability</li>
                      <li>• Public burning mechanism</li>
                      <li>• Batch transfer functionality</li>
                      <li>• 18 decimal precision</li>
                      <li>• Ownership transfer capability</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Security Features</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• OpenZeppelin base contracts</li>
                      <li>• Access control with Ownable</li>
                      <li>• Reentrancy protection</li>
                      <li>• Input validation</li>
                      <li>• Safe mathematical operations</li>
                      <li>• Event logging for transparency</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                  <code className="text-xs text-green-400">
                    contract MyToken is ERC20, ERC20Burnable, Ownable<br/>
                    function mint(address to, uint256 amount) external onlyOwner<br/>
                    function batchTransfer(address[] recipients, uint256[] amounts)
                  </code>
                </div>
              </div>
            </div>
          </Section>

          {/* Frontend Features */}
          <Section id="frontend-features" title="Frontend Application Features" icon={Smartphone}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-golden mb-3 flex items-center gap-2">
                    <Wallet size={18} />
                    Wallet Integration
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• MetaMask wallet connection</li>
                    <li>• Automatic network detection and switching</li>
                    <li>• Multi-network support (Mumbai, BSC Testnet)</li>
                    <li>• Transaction signing and confirmation</li>
                    <li>• Balance and account management</li>
                    <li>• Error handling for wallet issues</li>
                  </ul>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-golden mb-3 flex items-center gap-2">
                    <BarChart3 size={18} />
                    Token Management
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Browser-based token deployment</li>
                    <li>• Real-time token metadata reading</li>
                    <li>• Mint, burn, and transfer operations</li>
                    <li>• Owner-only access controls</li>
                    <li>• Transaction status tracking</li>
                    <li>• Gas estimation and optimization</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-golden mb-3 flex items-center gap-2">
                    <Database size={18} />
                    Trading Marketplace
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Simulated trading with local state</li>
                    <li>• Portfolio management and tracking</li>
                    <li>• Buy/sell functionality with validation</li>
                    <li>• Transaction history logging</li>
                    <li>• Real-time balance updates</li>
                    <li>• Market data simulation</li>
                  </ul>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-golden mb-3 flex items-center gap-2">
                    <Settings size={18} />
                    Admin Dashboard
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Role-based access control (User/Admin)</li>
                    <li>• Governance proposal simulation</li>
                    <li>• User management and blacklisting</li>
                    <li>• Platform fee configuration</li>
                    <li>• Comprehensive audit logging</li>
                    <li>• Multi-signature simulation</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* Analytics and Visualization */}
          <Section id="analytics" title="Analytics & Data Visualization" icon={BarChart3}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-effect p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-3">Portfolio Analytics</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                    <span><strong>Allocation Charts:</strong> Visual breakdown of token holdings with pie charts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                    <span><strong>Performance Metrics:</strong> ROI calculations and portfolio growth tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                    <span><strong>Historical Data:</strong> Price trends and trading volume analysis</span>
                  </li>
                </ul>
              </div>

              <div className="glass-effect p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-3">Interactive Features</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></div>
                    <span><strong>Recharts Integration:</strong> Responsive and interactive chart components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2"></div>
                    <span><strong>Real-time Updates:</strong> Dynamic data updates based on trading activity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2"></div>
                    <span><strong>Export Capabilities:</strong> Data export functionality for further analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          {/* ERC-20 Standards and Compliance */}
          <Section id="erc20-compliance" title="ERC-20 Standards & Compliance" icon={Shield}>
            <div className="space-y-6">
              <div className="glass-effect p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-4">ERC-20 Standard Implementation</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Required Functions</h4>
                    <ul className="space-y-1">
                      <li>• totalSupply() - Returns total token supply</li>
                      <li>• balanceOf(address) - Returns account balance</li>
                      <li>• transfer(to, amount) - Transfers tokens</li>
                      <li>• transferFrom(from, to, amount) - Approved transfers</li>
                      <li>• approve(spender, amount) - Approves spending</li>
                      <li>• allowance(owner, spender) - Returns allowance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Required Events</h4>
                    <ul className="space-y-1">
                      <li>• Transfer(from, to, value) - Transfer events</li>
                      <li>• Approval(owner, spender, value) - Approval events</li>
                    </ul>
                    <br/>
                    <h4 className="font-semibold text-yellow-400 mb-2">Extended Features</h4>
                    <ul className="space-y-1">
                      <li>• name() - Token name</li>
                      <li>• symbol() - Token symbol</li>
                      <li>• decimals() - Decimal places (18)</li>
                      <li>• burn(amount) - Token burning capability</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-4">Security and Best Practices</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Access Control</h4>
                    <ul className="space-y-1">
                      <li>• Owner-only minting</li>
                      <li>• Role-based permissions</li>
                      <li>• Ownership transferability</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Safety Measures</h4>
                    <ul className="space-y-1">
                      <li>• Overflow protection</li>
                      <li>• Reentrancy guards</li>
                      <li>• Input validation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Transparency</h4>
                    <ul className="space-y-1">
                      <li>• Event logging</li>
                      <li>• Open source code</li>
                      <li>• Audit-ready structure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Architecture and Infrastructure */}
          <Section id="architecture" title="System Architecture" icon={Layers}>
            <div className="space-y-6">
              <div className="glass-effect p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-4">Application Architecture</h3>
                <div className="text-sm text-gray-300">
                  <div className="bg-gray-900 p-4 rounded-lg font-mono text-xs">
                    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐<br/>
                    │   Frontend      │    │   Smart         │    │   Blockchain    │<br/>
                    │   (Next.js)     │◄──►│   Contracts     │◄──►│   (Mumbai/BSC)  │<br/>
                    │                 │    │   (Hardhat)     │    │                 │<br/>
                    ├─────────────────┤    ├─────────────────┤    ├─────────────────┤<br/>
                    │ • Wallet Connect│    │ • ERC20 Token   │    │ • Transaction   │<br/>
                    │ • State Mgmt    │    │ • OpenZeppelin  │    │   Processing    │<br/>
                    │ • UI Components │    │ • Deploy Script │    │ • Event Logs    │<br/>
                    │ • Error Handling│    │ • Test Suite    │    │ • Block Explorer│<br/>
                    └─────────────────┘    └─────────────────┘    └─────────────────┘
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-effect p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-golden mb-3">Project Structure</h3>
                  <div className="text-xs text-gray-300 font-mono bg-gray-900 p-3 rounded">
                    tokenization-platform/<br/>
                    ├── contracts/ (Smart contracts)<br/>
                    │   ├── contracts/MyToken.sol<br/>
                    │   ├── scripts/deploy.js<br/>
                    │   └── test/MyToken.test.js<br/>
                    ├── app/ (Next.js frontend)<br/>
                    │   ├── components/<br/>
                    │   ├── hooks/<br/>
                    │   ├── lib/<br/>
                    │   └── stores/<br/>
                    └── docs/ (Documentation)
                  </div>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-golden mb-3">Deployment Options</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                      <span><strong>Railway:</strong> Primary deployment platform with automatic builds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                      <span><strong>Vercel:</strong> Alternative deployment for Next.js applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                      <span><strong>Docker:</strong> Containerized deployment support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></div>
                      <span><strong>Local:</strong> Development environment with hot reload</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* Testing and Quality Assurance */}
          <Section id="testing" title="Testing & Quality Assurance" icon={Shield}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-effect p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-3">Smart Contract Testing</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Comprehensive test suite with Hardhat and Chai</li>
                  <li>• 100% function coverage for all contract methods</li>
                  <li>• Edge case testing for security vulnerabilities</li>
                  <li>• Gas optimization and efficiency testing</li>
                  <li>• Integration testing with frontend components</li>
                </ul>
              </div>

              <div className="glass-effect p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-golden mb-3">Frontend Quality</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• TypeScript for type safety and error prevention</li>
                  <li>• ESLint configuration for code quality</li>
                  <li>• Error boundaries for graceful failure handling</li>
                  <li>• Comprehensive input validation</li>
                  <li>• Cross-browser compatibility testing</li>
                </ul>
              </div>
            </div>
          </Section>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="max-w-md mx-auto">
            <p className="text-gray-400 mb-6">
              Ready to experience the platform? Launch the web application to interact with 
              all these features in a live environment.
            </p>
            <button
              onClick={onNavigateToApp}
              className="group w-full flex items-center justify-center gap-4 px-8 py-4 btn-golden rounded-xl text-lg font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30"
            >
              <span>Go to Web Application</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
