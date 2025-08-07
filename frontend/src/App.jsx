// React structure based on https://www.youtube.com/watch?v=G6D9cBaLViA

import Dashboard from './pages/Dashboard'
import LogFood from './pages/LogFood'
import AnalyzeMeal from './pages/AnalyzeMeal'
import LogExercise from './pages/LogExercise'
import SearchExercises from './pages/SearchExercises'
import GeneratePlan from './pages/GeneratePlan'
import Settings from './pages/Settings'
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <main className="mainContent">
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/logfood" element={<LogFood/>}/>
        <Route path="/analyzemeal" element={<AnalyzeMeal/>}/>
        <Route path="/logexercise" element={<LogExercise/>}/>
        <Route path="/searchexercises" element={<SearchExercises/>}/>
        <Route path="/generateplan" element={<GeneratePlan/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Routes>
    </main>
  )
}

export default App;
