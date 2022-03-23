import React from 'react'
import axios from 'axios'
import { useWeb3Context } from 'web3-react'

import { useConf } from './ConfProvider'

type WrappedContext = {
  library: any
}

const Web3WrappedContext = React.createContext<Maybe<WrappedContext>>(null)

export const useWrappedWeb3 = () => {
  const context = React.useContext(Web3WrappedContext)

  if (!context) {
    throw new Error('useWrappedWeb3 must be used within a Web3ProviderWrapper')
  }

  return context
}

export const WrappedWeb3Provider: React.FC = ({ children }) => {
  const { conf } = useConf()
  const [error, setError] = React.useState(false)
  const context = useWeb3Context()

  React.useEffect(() => {
    context.setFirstValidConnector(['LocalNetwork'])
  }, [context])

  React.useEffect(() => {
    axios
      .post(conf.rpcUrl, { jsonrpc: '2.0', method: 'web3_clientVersion', params: [], id: 67 })
      .catch(() => setError(true))
  }, [conf])

  if (error) {
    return (
      <span>
        ไม่สามารถเชื่อมต่อ RPC ของ Chain ได้ {conf.rpcUrl}. กรุณาเปลี่ยน RPC
        หรือว่าเริ่มต้นการทำงานของ Chain ก่อน
      </span>
    )
  }

  if (!context.library) {
    return null
  }

  const value = { library: context.library }

  return <Web3WrappedContext.Provider value={value}>{children}</Web3WrappedContext.Provider>
}
