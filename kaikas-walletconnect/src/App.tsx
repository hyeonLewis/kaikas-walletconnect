import { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Web3 from 'web3'
import Web3Modal from '@klaytn/web3modal'
import { KaikasWeb3Provider } from '@klaytn/kaikas-web3-provider'
import { isMobile } from 'react-device-detect'
import { getChainData, addressDisplay } from './helpers/utilites'
import { addresses, ChainId } from './constants/klaytn'
import { Counter } from './abi'
import './App.css'

function App() {
  const [chainId, setChainId] = useState<ChainId>(ChainId.CYPRESS)
  const [connected, setConnected] = useState<boolean>(false)
  const [address, setAddress] = useState('')
  const [web3modal, setWeb3modal] = useState<any>()
  const [running, setRunning] = useState<boolean>(false)
  const [counter, setCounter] = useState<any>()
  const [count, setCount] = useState<number>(0)
  const [value, setValue] = useState<number>(0)
  const href = window.location.href

  useEffect(() => {
    if (chainId !== ChainId.CYPRESS && chainId !== ChainId.BAOBAB) {
      resetApp()
      alert('Please change network to the Klaytn')
      return
    }
    const getNetwork = (): string => getChainData(chainId).network
    setWeb3modal(
      new Web3Modal({
        network: getNetwork(),
        cacheProvider: false,
        providerOptions: getProviderOptions(),
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])

  const initWeb3 = (provider: any): any => {
    const web3: any = new Web3(provider)
    return web3
  }
  const onConnect = async (): Promise<void> => {
    const provider = await web3modal.connect()
    await provider.enable()
    const web3 = initWeb3(provider)
    const accounts = await web3.eth.getAccounts()
    const chainId = (await web3.eth.getChainId()) as ChainId
    const counter = new web3.eth.Contract(Counter, addresses[chainId].Counter!)
    setCounter(counter)
    setCount(await counter.methods.getCounts().call())
    setAddress(accounts[0])
    setChainId(chainId)
    setConnected(true)
    await subscribeProvider(provider, web3)
  }

  const getProviderOptions = (): any => {
    const providerOptions = {
      kaikas: {
        package: KaikasWeb3Provider,
      },
    }
    return providerOptions
  }

  const subscribeProvider = async (provider: any, web3: any): Promise<void> => {
    if (!provider.on) {
      return
    }
    provider.on('close', () => resetApp())
    provider.on('accountsChanged', async (accounts: string[]) => {
      setAddress(accounts[0])
    })
    provider.on('chainChanged', async (chainId: string) => {
      setChainId(Number(chainId))
    })
    provider.on('networkChanged', async (networkId: number) => {
      const chainId = await web3.eth.getChainId()
      setChainId(chainId)
    })
  }

  const resetApp = async (): Promise<void> => {
    web3modal.clearCachedProvider()
    //Initial state
    setAddress('')
    setChainId(8217)
    setConnected(false)
  }

  const updateCounter = useCallback(
    async (upDown: boolean) => {
      setRunning(true)
      try {
        if (upDown) {
          const gas = await counter.methods
            .increaseCount()
            .estimateGas({ from: address })
          await counter.methods
            .increaseCount()
            .send({ from: address, gas: gas, gasPrice: 25000000000 })
        } else {
          const gas = await counter.methods
            .decreaseCount()
            .estimateGas({ from: address })
          await counter.methods
            .decreaseCount()
            .send({ from: address, gas: gas, gasPrice: 25000000000 })
        }
      } catch (e) {
        console.log(e)
        setRunning(false)
      } finally {
        setRunning(false)
      }
      setCount(await counter.methods.getCounts().call())
    },
    [counter, address]
  )

  const setCounterWithValue = useCallback(
    async (value: number) => {
      const gas = await counter.methods
        .setCount(value)
        .estimateGas({ from: address })
      setRunning(true)
      try {
        await counter.methods
          .setCount(value)
          .send({ from: address, gas: gas, gasPrice: 25000000000 })
      } catch (e) {
        console.log(e)
        setRunning(false)
      } finally {
        setRunning(false)
      }
      setCount(await counter.methods.getCounts().call())
    },
    [counter, address]
  )

  return (
    <div className="App">
      <p className="App-name">Kaikas-Web3Modal</p>
      {connected && (
        <div className="App-header-body">
          <Button
            style={{
              marginLeft: '10px',
            }}
            variant="contained"
            onClick={() => {
              resetApp()
            }}
          >
            {`Disconnect Wallet: ${addressDisplay(address)}`}
          </Button>
        </div>
      )}
      <div className="App-content">
        {connected ? (
          <Box>
            <div className="Content">
              <div>
                <Button
                  variant="contained"
                  disabled={running}
                  onClick={() => {
                    updateCounter(true)
                  }}
                >
                  Increase Counter
                </Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  variant="contained"
                  disabled={running}
                  onClick={() => {
                    updateCounter(false)
                  }}
                >
                  Decrease Counter
                </Button>
              </div>
              <Button
                style={{ marginLeft: '10px', marginTop: '10px' }}
                variant="contained"
                disabled={running}
                onClick={() => {
                  setCounterWithValue(value)
                }}
              >
                Set Counter
              </Button>
              <TextField
                style={{
                  backgroundColor: 'white',
                  marginLeft: '10px',
                  marginTop: '10px',
                }}
                label="Set Counter"
                type="number"
                value={value}
                color="secondary"
                variant="filled"
                onChange={(e) => {
                  setValue(Number(e.target.value))
                }}
              />
              <p>Counts: {count}</p>
            </div>
          </Box>
        ) : isMobile ? (
          <div>
            <p>Mobile</p>
            <a href={`https://app.kaikas.io/u/${href}`}>Kaikas</a>
          </div>
        ) : (
          <Button
            variant="contained"
            disabled={running}
            onClick={() => {
              onConnect()
            }}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  )
}

export default App
