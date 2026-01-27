import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../views/Home'
import Servers from '../views/Servers'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/http-servers" element={<Servers />} />
  </Routes>
)

export default AppRoutes
