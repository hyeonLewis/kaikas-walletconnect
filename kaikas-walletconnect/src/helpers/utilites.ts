import chains from './chains'
import { IChainData } from '../types/web3modal'

export function getChainData(chainId: number): IChainData {
  const chainData = chains.filter((chain) => chain.chain_id === chainId)[0]

  if (!chainData) {
    throw new Error('ChainId missing or not supported')
  }

  return {
    ...chainData,
    rpc_url: chainData.rpc_url,
  }
}

export function addressDisplay(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
    address.length
  )}`
}
