import { IChainData } from '../types/web3modal'

const chains: IChainData[] = [
  {
    name: 'Klaytn Mainnet',
    short_name: 'klaytn',
    chain: 'klaytn',
    network: 'cypress',
    chain_id: 8217,
    network_id: 8217,
    rpc_url: 'https://public-en-cypress.klaytn.net',
    native_currency: {
      symbol: 'KLAY',
      name: 'KLAY',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Klaytn Testnet',
    short_name: 'klaytn',
    chain: 'klaytn',
    network: 'baobab',
    chain_id: 1001,
    network_id: 1001,
    rpc_url: 'https://public-en-baobab.klaytn.net',
    native_currency: {
      symbol: 'KLAY',
      name: 'KLAY',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
]

export default chains
