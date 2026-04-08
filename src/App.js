import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MyProvider } from './context/MyContext';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ClientDashboard from './pages/clients/ClientDashboard.jsx'; 
import NewRequest from './pages/clients/NewRequest.jsx';
import TechnicianDashboard from './pages/technicians/TechnicianDashboard.jsx';
import AdministratorDashboard from './pages/administrator/AdministratorDashboard.jsx';
import AdministratorRequests from './pages/administrator/AdministratorRequests.jsx';
import AdministratorClients from './pages/administrator/AdministratorClients.jsx';
import AdministratorTechnicians from './pages/administrator/AdministratorTechnicians.jsx';
import AdministratorNavbar from './pages/administrator/AdministratorNavbar.jsx';
import './index.css';


function App() {
  return (
    <BrowserRouter>
      <MyProvider>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/new-request" element={<NewRequest />}  />
        <Route path="/technician"  element={<TechnicianDashboard />} />

        
        <Route path="administrator"  element={<AdministratorDashboard />} />
        <Route path="administrator/requests"  element={<AdministratorRequests />} />
        <Route path="administrator/clients"  element={<AdministratorClients />} />
        <Route path="administrator/technicians"  element={<AdministratorTechnicians />} />
      </Routes>
      
      </MyProvider>
    </BrowserRouter>    
  );
}

export default App;
