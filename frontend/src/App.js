import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import EmployeeDashboard from './elements/EmployeeDashboard'
import AdminDashboard from './elements/AdminDashboard'
import AddCoffeeForm from './elements/AddCoffeeForm'
import AddEmployeeForm from './elements/AddEmployeeForm'
import ManageEmployees from "./elements/ManageEmployees";
import Login from './elements/Login'


function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/logare" />} />

        <Route path="/logare" element={<Login />} />
        <Route path="/employeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/adaugare-cafea" element={<AddCoffeeForm />}/>
        <Route path="/adaugare-angajat" element={<AddEmployeeForm />} />
        <Route path="/gestionare-angajati" element={<ManageEmployees />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App