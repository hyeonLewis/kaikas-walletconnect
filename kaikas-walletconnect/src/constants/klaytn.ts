export enum ChainId {
  BAOBAB = 1001,
  CYPRESS = 8217,
}

export interface Addresses {
  Counter: string
}

export const addresses: { [chainId in ChainId]: Addresses } = {
  [ChainId.BAOBAB]: {
    Counter: '0xb20c3f081b4e35cd24b17beb79a85d2de51940cd',
  },
  [ChainId.CYPRESS]: {
    Counter: '0xb879e65115d3925ea34a9e9a566ef3eb1b940bc3',
  },
}
