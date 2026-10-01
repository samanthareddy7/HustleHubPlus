import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/home";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"

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
                     
                     <Route path="/gigs" element={ <div className="container py-5"> <h1>Browse Gigs</h1> <p> Gig marketplace coming next. </p> </div> } /> 
                     
                     <Route path="*" element={ <div className="container py-5"> <h1>404</h1> <p> Page not found. </p> </div> } /> 
                
                </Routes>

            </main>

        </BrowserRouter>
    );
}

export default App;