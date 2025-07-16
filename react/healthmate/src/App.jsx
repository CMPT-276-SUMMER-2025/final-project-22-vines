import './App.css'
import Login from "./pages/Login"
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Login/>}/>
      </Routes>
    </main>
  )
}

export default App
