import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import EmployeeDashboard from './elements/EmployeeDashboard'
import AdminDashboard from './elements/AdminDashboard'
import Create from './elements/Create'
import Edit from './elements/Edit'
import Read from './elements/Read'
import Login from './elements/Login'


function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/logare" />} />

        <Route path="/logare" element={<Login />} />
        <Route path="/employeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/read:/id" element={<Read />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App