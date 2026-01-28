import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

declare global {
  interface Window {
    ipcRenderer: {
      on(channel: string, listener: (event: unknown, message: unknown) => void): void;
    };
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
