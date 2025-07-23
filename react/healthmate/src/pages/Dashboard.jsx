import NavBar from '../components/NavBar'

function Dashboard() {
    return (
        <>
            <NavBar/>
            <div className="dashboard">
                <div className="loggedMeals"></div>
                <div className="nutritionInfo"></div>
                <div className="trackedExercises"></div>
            </div>
        </> 
    )
}

export default Dashboard