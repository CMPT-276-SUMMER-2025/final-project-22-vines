import './App.css'
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </main>
  )
}

export default App
