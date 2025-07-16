import NavBar from '../components/NavBar'
import {useState} from 'react'

function SearchResult({food}) {
    return (
        <div>
            <p>{food.name}</p>
            <button type="button">+</button>
        </div>
    )
}

function NutritionalInfo({food}) {
    return (
        <div>
            <p>Nutritional Information</p>
            <p>{food.name}</p>
            <p>{food.serving}g</p>
            <p>{food.calories}g</p>
            <p>{food.protein}g</p>
            <p>{food.fat}g</p>
            <p>{food.carbohydrates}g</p>
        </div>
    )
}

function AnalyzeMeal() {
    const [searchQuery, setSearchQuery] = useState("");
    
    const meals = [
        {
            id: 0,
            name: "apple",
            serving: 182,
            calories: 95,
            fat: 0.3,
            carbohydrates: 25
        },
        {
            id: 1,
            name: "bread",
            serving: 182,
            calories: 95,
            fat: 0.3,
            carbohydrates: 25
        }
    ]
    
    const handleSearch = (e) => {
        e.preventDefault()
    };

    return (
        <>
            <NavBar/>
            <div className="analyzeMeal">
                <div className="searchMenu">
                    <form onSubmit={handleSearch} className="searchForm">
                        <input
                            type="text"
                            placeholder="Search for meals..."
                            className="searchInput"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <div className="searchResults">
                        {meals.map(
                            (food) =>
                                food.name.toLowerCase().startsWith(searchQuery) && (
                                    <SearchResult food={food} key={food.id} />
                                )
                        )}
                    </div>
                </div>
                <div className="nutritionalInfo">
                    <NutritionalInfo food={meals[0]}/>
                </div>
                <div className="additionalInfo"></div>
            </div>
        </> 
    )
}

export default AnalyzeMeal