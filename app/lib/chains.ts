import { Chain } from 'viem'

// Polygon Mumbai Testnet
export const mumbai: Chain = {
  id: 80001,
  name: 'Polygon Mumbai',
  network: 'mumbai',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    public: { http: ['https://rpc-mumbai.maticvigil.com'] },
    default: { http: [process.env.NEXT_PUBLIC_INFRA_RPC_MUMBAI || 'https://rpc-mumbai.maticvigil.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'PolygonScan', url: 'https://mumbai.polygonscan.com' },
    default: { name: 'PolygonScan', url: 'https://mumbai.polygonscan.com' },
  },
  testnet: true,
}

// BNB Smart Chain Testnet
export const bscTestnet: Chain = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
    default: { http: [process.env.NEXT_PUBLIC_INFRA_RPC_BNBTEST || 'https://data-seed-prebsc-1-s1.binance.org:8545'] },
  },
  blockExplorers: {
    etherscan: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  testnet: true,
}

// Supported chains configuration
export const supportedChains = [mumbai, bscTestnet] as const

export type SupportedChain = typeof supportedChains[number]

// Get default chain from environment
export const getDefaultChain = (): SupportedChain => {
  const defaultNetwork = process.env.NEXT_PUBLIC_DEFAULT_NETWORK || 'mumbai'
  
  switch (defaultNetwork) {
    case 'bsc-testnet':
      return bscTestnet
    case 'mumbai':
    default:
      return mumbai
  }
}

// Chain helpers
export const getChainById = (chainId: number): SupportedChain | undefined => {
  return supportedChains.find(chain => chain.id === chainId)
}

export const getChainName = (chainId: number): string => {
  const chain = getChainById(chainId)
  return chain?.name || `Unknown Chain (${chainId})`
}

export const getBlockExplorerUrl = (chainId: number): string => {
  const chain = getChainById(chainId)
  return chain?.blockExplorers.default.url || ''
}

export const getTransactionUrl = (chainId: number, txHash: string): string => {
  const baseUrl = getBlockExplorerUrl(chainId)
  return baseUrl ? `${baseUrl}/tx/${txHash}` : ''
}

export const getAddressUrl = (chainId: number, address: string): string => {
  const baseUrl = getBlockExplorerUrl(chainId)
  return baseUrl ? `${baseUrl}/address/${address}` : ''
}

export const isChainSupported = (chainId: number): boolean => {
  return supportedChains.some(chain => chain.id === chainId)
}

// Faucet URLs
export const getFaucetUrl = (chainId: number): string => {
  switch (chainId) {
    case mumbai.id:
      return 'https://faucet.polygon.technology/'
    case bscTestnet.id:
      return 'https://testnet.binance.org/faucet-smart'
    default:
      return ''
  }
}
