import Dashboard from './pages/Dashboard'
import AnalyzeMeal from './pages/AnalyzeMeal'
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/analyzemeal" element={<AnalyzeMeal/>}/>
      </Routes>
    </main>
  )
}

export default App;
