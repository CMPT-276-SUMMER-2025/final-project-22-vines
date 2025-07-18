import NavBar from '../components/NavBar'
import {useState} from 'react'
import "../css/AnalyzeMeal.css";

function SearchResult({food, handleClick}) {
    return (
        <div className="searchResult">
            <button type="button" onClick={() => handleClick(food)}>+</button>
            <p>{food.name}</p>
        </div>
    )
}

function NutritionalInfo({food}) {
    if (food === "") {
        return (
            <div>
                <p>Search for a meal and click the "+" button to view nutritional information here.</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <p>{food.name}</p>
                <p>Serving size: {food.serving}g</p>
                <p>Calories: {food.calories}</p>
                <p>Protein: {food.protein}g</p>
                <p>Fat: {food.fat}g</p>
                <p>Carbohydrates: {food.carbohydrates}g</p>
            </div>
        )
    }
}

function AdditionalInfo() {
    return (
        <div>
            <p>Additonal information/tips about the selected food goes here.</p>
        </div>
    )
}

function AnalyzeMeal() {
    const [searchQuery, setSearchQuery] = useState("");
    const [info, setInfo] = useState("");
    
    const meals = [
        {
            id: 0,
            name: "apple",
            serving: 182,
            calories: 95,
            protein: 0.5,
            fat: 0.3,
            carbohydrates: 25
        },
        {
            id: 1,
            name: "bread",
            serving: 29,
            calories: 77,
            protein: 2.6, 
            fat: 1,
            carbohydrates: 14
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
                                    <SearchResult food={food} key={food.id} handleClick={setInfo}/>
                                )
                        )}
                    </div>
                </div>
                <div className="nutritionalInfo">
                    <p>Nutritional Information</p>
                    <NutritionalInfo food={info}/>
                </div>
                <div className="additionalInfo">
                    <p>Additional information</p>
                    <AdditionalInfo/>
                </div>
            </div>
        </> 
    )
}

export default AnalyzeMeal