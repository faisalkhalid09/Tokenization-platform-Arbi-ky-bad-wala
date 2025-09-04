import { http, createConfig } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { supportedChains } from './chains'

export const config = createConfig({
  chains: supportedChains,
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'Blockchain Tokenization Platform',
        url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      },
    }),
  ],
  transports: {
    [supportedChains[0].id]: http(),
    [supportedChains[1].id]: http(),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
