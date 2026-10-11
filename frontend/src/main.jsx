/*
Author: React
Date Accessed: 11 October 2026
Link: https://react.dev/reference/react-dom/client/createRoot
Reason: Used to render the root App component into the DOM with createRoot and StrictMode.
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootswatch/dist/lux/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
