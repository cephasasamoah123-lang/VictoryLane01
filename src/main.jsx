import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import api from './lib/api'
import './index.css'

// Wake up the backend (and its database) the instant the tab opens - see prior
// discussion: Render/Neon free tiers sleep after ~15 min idle and take 20-50s to
// spin back up on the first real request, so we start that clock immediately.
api.get('/health').catch(() => {})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {})
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
