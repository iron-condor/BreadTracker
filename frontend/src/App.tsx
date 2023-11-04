import './App.css';
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import BreadNavbar from './components/breadnavbar/BreadNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Recipes from './pages/recipes/Recipes';
import Starters from './pages/starters/Starters';

function App() {
  return (
    <>
      <BrowserRouter>
        <BreadNavbar/>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/starters" element={<Starters/>}/>
          <Route path="/recipes" element={<Recipes/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
