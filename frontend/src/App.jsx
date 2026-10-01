import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/home";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"
import Gigs from "./pages/Gigs";
import MyGigs from "./pages/MyGigs";
import GigForm from "./pages/GigForm";
import MyBookings from "./pages/MyBookings";
import FreelancerBookings from "./pages/FreelancerBookings";
import FreelancerIncome from "./pages/FreelancerIncome";

import "./App.css";


function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <main>

                <Routes> 
                     <Route path="/" element={<Home />} /> 
                     
                     <Route path="/login" element={<Login />} /> 
                     
                     <Route path="/register" element={<Register />} /> 
                    
                     <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } /> 
                     
                     <Route path="/gigs" element={<Gigs />} /> 

                     <Route path="/gigs/create" element={  <RoleRoute allowedRole="freelancer"> <GigForm /> </RoleRoute> } />  
                     
                     <Route path="/gigs/edit/:id" element={  <RoleRoute allowedRole="freelancer"> <GigForm /> </RoleRoute> } />  
                     
                     <Route path="/my-gigs" element={  <RoleRoute allowedRole="freelancer"> <MyGigs /> </RoleRoute> } />  

                     <Route path="/my-bookings" element={ <ProtectedRoute> <MyBookings /> </ProtectedRoute> } />  
                     <Route path="/freelancer-bookings" element={  <RoleRoute allowedRole="freelancer"> <FreelancerBookings /> </RoleRoute> } />  
                     <Route path="/income" element={  <RoleRoute allowedRole="freelancer"> <FreelancerIncome /> </RoleRoute> } />  


                     <Route path="*" element={ <div className="container py-5"> <h1>404</h1> <p> Page not found. </p> </div> } /> 
                
                </Routes>

            </main>

        </BrowserRouter>
    );
}

export default App;