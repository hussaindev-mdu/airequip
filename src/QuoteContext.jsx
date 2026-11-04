import { createContext, useContext, useMemo, useState } from 'react'
import { QuoteModal } from './components/Layout'

const Ctx = createContext({ openQuote: () => {}, openCatalogue: () => {} })
export const useQuote = () => useContext(Ctx)

export function QuoteProvider({ children }) {
  const [modal, setModal] = useState(null)
  const value = useMemo(() => ({ openQuote: () => setModal('quote'), openCatalogue: () => setModal('catalogue') }), [])
  return (
    <Ctx.Provider value={value}>
      {children}
      <QuoteModal open={!!modal} catalogue={modal === 'catalogue'} onClose={() => setModal(null)} />
    </Ctx.Provider>
  )
}
