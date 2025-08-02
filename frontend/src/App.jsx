import Dashboard from './pages/Dashboard'
import LogFood from './pages/LogFood'
import AnalyzeMeal from './pages/AnalyzeMeal'
import TrackExercise from './pages/TrackExercise'
import SearchExercises from './pages/SearchExercises'
import Settings from './pages/Settings'
import {Routes, Route} from "react-router-dom"

function App() {
  return (
    <main className="mainContent">
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/logfood" element={<LogFood/>}/>
        <Route path="/analyzemeal" element={<AnalyzeMeal/>}/>
        {/* <Route path="/trackexercise" element={<TrackExercise/>}/> */}
        <Route path="/searchexercises" element={<SearchExercises/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Routes>
    </main>
  )
}

export default App;
