import './App.css'
import Layout from './Layout/Layout'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './router/router'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  )
}

export default App
