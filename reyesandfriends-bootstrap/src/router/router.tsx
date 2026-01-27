import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../views/Home'
import Servers from '../views/Servers'
import Databases from '../views/Databases'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/http-servers" element={<Servers />} />
    <Route path="/sql-scripts" element={<Databases />} />
  </Routes>
)

export default AppRoutes
