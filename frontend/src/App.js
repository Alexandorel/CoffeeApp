import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EmployeeDashboard from './pages/EmployeeDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AddCoffeeForm from './pages/AddCoffeeForm'
import EditCoffee from './pages/EditCoffee'
import OrderHistory from './pages/OrderHistory';
import EmployeeHistory from "./pages/EmployeeHistory";
import AddEmployeeForm from './pages/AddEmployeeForm'
import ManageEmployees from "./pages/ManageEmployees";
import EditEmployee from "./pages/EditEmployee";
import Login from './pages/Login'


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
        <Route path="/editare-angajat/:id" element={<EditEmployee />} />
        <Route path="/editare-cafea/:id" element={<EditCoffee />} />
        <Route path="/istoric" element={<OrderHistory />} />
        <Route path="/istoric-personal" element={<EmployeeHistory />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App