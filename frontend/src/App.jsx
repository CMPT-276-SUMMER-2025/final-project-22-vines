import Dashboard from './pages/Dashboard'
import LogFood from './pages/LogFood'
import AnalyzeMeal from './pages/AnalyzeMeal'
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <main className="mainContent">
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/logfood" element={<LogFood/>}/>
        <Route path="/analyzemeal" element={<AnalyzeMeal/>}/>
      </Routes>
    </main>
  )
}

export default App;
