import NavBar from '../components/NavBar'

function AnalyzeMeal() {
    return (
        <>
            <NavBar/>
            <div className="analyzeMeal">
                <div className="searchBar"></div>
                <div className="nutritionalInfo"></div>
                <div className="additionalInfo"></div>
            </div>
        </> 
    )
}

export default AnalyzeMeal