import { Contract, formatUnits, parseUnits, isAddress } from 'ethers'
import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { config } from './wagmi'

// Standard ERC20 ABI functions we need
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function burn(uint256 amount)',
  'function mint(address to, uint256 amount)',
  'function owner() view returns (address)',
] as const

// MyToken contract ABI from the compiled artifact
export const MYTOKEN_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name_", "type": "string" },
      { "internalType": "string", "name": "symbol_", "type": "string" },
      { "internalType": "uint256", "name": "initialSupply_", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "allowance", "type": "uint256" },
      { "internalType": "uint256", "name": "needed", "type": "uint256" }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "uint256", "name": "balance", "type": "uint256" },
      { "internalType": "uint256", "name": "needed", "type": "uint256" }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "approver", "type": "address" }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "receiver", "type": "address" }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "recipients", "type": "address[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
    ],
    "name": "batchTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "burnFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  owner: string
  address: string
}

export interface TokenBalance {
  balance: string
  formatted: string
}

// Helper functions for token operations
export const formatTokenAmount = (amount: string, decimals: number): string => {
  return formatUnits(amount, decimals)
}

export const parseTokenAmount = (amount: string, decimals: number): bigint => {
  return parseUnits(amount, decimals)
}

export const validateAddress = (address: string): boolean => {
  return isAddress(address)
}

// Read token information
export const readTokenInfo = async (
  tokenAddress: string,
  chainId: number
): Promise<TokenInfo> => {
  try {
    const [name, symbol, decimals, totalSupply, owner] = await Promise.all([
      readContract(config as any, {
        address: tokenAddress as `0x${string}`,
        abi: MYTOKEN_ABI,
        functionName: 'name',
        chainId,
      }),
      readContract(config as any, {
        address: tokenAddress as `0x${string}`,
        abi: MYTOKEN_ABI,
        functionName: 'symbol',
        chainId,
      }),
      readContract(config as any, {
        address: tokenAddress as `0x${string}`,
        abi: MYTOKEN_ABI,
        functionName: 'decimals',
        chainId,
      }),
      readContract(config as any, {
        address: tokenAddress as `0x${string}`,
        abi: MYTOKEN_ABI,
        functionName: 'totalSupply',
        chainId,
      }),
      readContract(config as any, {
        address: tokenAddress as `0x${string}`,
        abi: MYTOKEN_ABI,
        functionName: 'owner',
        chainId,
      }),
    ])

    return {
      name: name as string,
      symbol: symbol as string,
      decimals: decimals as number,
      totalSupply: (totalSupply as bigint).toString(),
      owner: owner as string,
      address: tokenAddress,
    }
  } catch (error) {
    console.error('Failed to read token info:', error)
    throw new Error('Invalid token address or network error')
  }
}

// Read token balance for an address
export const readTokenBalance = async (
  tokenAddress: string,
  userAddress: string,
  chainId: number
): Promise<TokenBalance> => {
  try {
    const [balance, decimals] = await Promise.all([
      readContract(config as any, {
        address: tokenAddress as `0x${string}`,
        abi: MYTOKEN_ABI,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`],
        chainId,
      }),
      readContract(config as any, {
        address: tokenAddress as `0x${string}`,
        abi: MYTOKEN_ABI,
        functionName: 'decimals',
        chainId,
      }),
    ])

    const balanceStr = (balance as bigint).toString()
    const formatted = formatUnits(balance as bigint, decimals as number)

    return {
      balance: balanceStr,
      formatted,
    }
  } catch (error) {
    console.error('Failed to read token balance:', error)
    return {
      balance: '0',
      formatted: '0',
    }
  }
}

// Token operations
export const mintTokens = async (
  tokenAddress: string,
  toAddress: string,
  amount: string,
  chainId: number
): Promise<string> => {
  const hash = await writeContract(config as any, {
    address: tokenAddress as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'mint',
    args: [toAddress as `0x${string}`, parseUnits(amount, 0)], // Amount in whole tokens
    chainId,
  })

  return hash
}

export const burnTokens = async (
  tokenAddress: string,
  amount: string,
  decimals: number,
  chainId: number
): Promise<string> => {
  const hash = await writeContract(config as any, {
    address: tokenAddress as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'burn',
    args: [parseUnits(amount, decimals)],
    chainId,
  })

  return hash
}

export const transferTokens = async (
  tokenAddress: string,
  toAddress: string,
  amount: string,
  decimals: number,
  chainId: number
): Promise<string> => {
  const hash = await writeContract(config as any, {
    address: tokenAddress as `0x${string}`,
    abi: MYTOKEN_ABI,
    functionName: 'transfer',
    args: [toAddress as `0x${string}`, parseUnits(amount, decimals)],
    chainId,
  })

  return hash
}

// Wait for transaction confirmation
export const waitForTransaction = async (hash: string, chainId: number) => {
  return await waitForTransactionReceipt(config as any, {
    hash: hash as `0x${string}`,
    chainId,
  })
}
