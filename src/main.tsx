import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main className="grid min-h-dvh place-items-center bg-[#F5F7FA] p-6 text-[#263238]">
      <p className="text-lg font-semibold">AJEMS — site en construction</p>
    </main>
  </StrictMode>,
)
