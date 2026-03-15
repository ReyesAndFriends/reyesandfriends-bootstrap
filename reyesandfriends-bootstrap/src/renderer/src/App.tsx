import './App.css'
import Layout from './Layout/Layout'
import { HashRouter } from 'react-router-dom'
import AppRoutes from './router/router'

function App() {
  return (
    <HashRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </HashRouter>
  )
}

export default App
