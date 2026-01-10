import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right"
     toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
        },
        // Success
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        // Error
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        // Loading
        loading: {
          iconTheme: {
            primary: '#a855f7',
            secondary: '#fff',
          },
        },
      }}
    />
  </StrictMode>,
)
