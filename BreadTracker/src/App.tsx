import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BreadNavbar from './components/BreadNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <BreadNavbar/>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/starters" element={<div>Starters</div>}/>
          <Route path="/recipes" element={<div>Recipes</div>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
