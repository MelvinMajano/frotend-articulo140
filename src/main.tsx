import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Articulo140App } from './articulo-140/Articulo140App'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Articulo140App />
  </StrictMode>,
)
