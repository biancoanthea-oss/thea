import React from 'react'
import { createRoot } from 'react-dom/client'
import StackedMarketingHub from './StackedMarketingHub.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StackedMarketingHub />
  </React.StrictMode>,
)
