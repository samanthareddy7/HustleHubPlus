/*
Code Attribution
https://vite.dev/guide/api-plugin
https://vitest.dev/config/
https://react.dev/reference/react-dom/client/createRoot
https://reactrouter.com/start/declarative/routing
https://javascript.info/fetch
https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
https://dev.to/m_yousaf/implementing-role-based-access-control-in-react-18-with-react-router-v6-a-step-by-step-guide-1p8b
https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
https://www.w3schools.com/react/react_forms.asp
https://www.robinwieruch.de/react-router-private-routes/
https://getbootstrap.com/docs/5.3/components/spinners/
https://react.dev/reference/react/useEffect
https://reactrouter.com/api/hooks/useNavigate
https://getbootstrap.com/docs/5.3/components/navbar/
https://getbootstrap.com/docs/5.3/components/card/
https://react.dev/learn/reacting-to-input-with-state
https://getbootstrap.com/docs/5.3/components/alerts/
https://react.dev/reference/react-dom/components/select
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
https://react.dev/learn/updating-arrays-in-state
https://getbootstrap.com/docs/5.3/content/tables/
https://react.dev/learn/synchronizing-with-effects
https://getbootstrap.com/docs/5.3/forms/form-control/
https://react.dev/reference/react/useState
https://getbootstrap.com/docs/5.3/examples/heroes/
https://learn.microsoft.com/en-us/windows/dev-environment/javascript/react-beginners-tutorial
https://www.freecodecamp.org/news/how-to-fetch-api-data-in-react/
https://react.dev/learn/updating-objects-in-state
https://getbootstrap.com/docs/5.3/forms/validation/
https://getbootstrap.com/docs/5.3/components/modal/
https://reactrouter.com/api/hooks/useParams
https://getbootstrap.com/docs/5.3/components/progress/
https://react.dev/learn/rendering-lists
https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
https://www.w3schools.com/jsref/jsref_tolocaledatestring.asp
https://react.dev/learn/conditional-rendering
https://getbootstrap.com/docs/5.3/components/badge/
https://getbootstrap.com/docs/5.3/content/tables/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
*/


/*
Author: React Router
Date Accessed: 11 October 2026
Link: https://reactrouter.com/start/declarative/routing
Reason: Used to set up BrowserRouter, Routes and Route for the application pages and the 404 route.
*/

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import OwnerRoute from "./components/OwnerRoute";

import Home from "./pages/Home";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"
import Gigs from "./pages/Gigs";
import MyGigs from "./pages/MyGigs";
import GigForm from "./pages/GigForm";
import GigDetails from "./pages/GigDetails";
import MyBookings from "./pages/MyBookings";
import FreelancerBookings from "./pages/FreelancerBookings";
import FreelancerIncome from "./pages/FreelancerIncome";
import AdminDashboard from "./pages/AdminDashboard";

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
                     
                     <Route path="/gigs/edit/:id" element={  <OwnerRoute allowedRole="freelancer"> <GigForm /> </OwnerRoute> } />  
                     
                     <Route path="/my-gigs" element={  <RoleRoute allowedRole="freelancer"> <MyGigs /> </RoleRoute> } />  
                      <Route path="/gigs/:id" element={  <GigDetails /> } />  

                     <Route path="/my-bookings" element={ <ProtectedRoute> <MyBookings /> </ProtectedRoute> } />  
                     <Route path="/freelancer-bookings" element={  <RoleRoute allowedRole="freelancer"> <FreelancerBookings /> </RoleRoute> } />  
                     <Route path="/income" element={  <RoleRoute allowedRole="freelancer"> <FreelancerIncome /> </RoleRoute> } />  
<Route path="/admin" element={ <RoleRoute allowedRole="admin"> <AdminDashboard /> </RoleRoute> } />

                     <Route path="*" element={ <div className="container py-5"> <h1>404</h1> <p> Page not found. </p> </div> } /> 
                
                </Routes>

            </main>

        </BrowserRouter>
    );
}

export default App;