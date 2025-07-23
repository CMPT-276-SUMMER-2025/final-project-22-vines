import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import AnalyzeMeal from './pages/AnalyzeMeal'
import AnalyzeMeal2 from "./pages/AnalyzeMeal2"
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <main className="mainContent">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/analyzemeal" element={<AnalyzeMeal/>}/>
        <Route path="/analyzemeal2" element={<AnalyzeMeal2/>}/>
      </Routes>
    </main>
  )
}

export default App
