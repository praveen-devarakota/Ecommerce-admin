import React from 'react'
import {Routes , Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AdminLoginPage from './pages/AdminLoginPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLoginPage/>} />
        <Route path="/admin-dashboard" element={<Dashboard/>} />
        <Route path="/users" element={<h1>Users List</h1>} />
        <Route path="/products" element={<h1>Products List</h1>} />
        <Route path="/carts" element={<h1>Carts List</h1>} />
      </Routes>
    </>
  )
}

export default App
