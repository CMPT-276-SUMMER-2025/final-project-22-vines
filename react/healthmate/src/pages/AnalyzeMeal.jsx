import NavBar from '../components/NavBar'

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
    const meals = [
        {
            name: "apple",
            serving: 182,
            calories: 95,
            fat: 0.3,
            carbohydrates: 25
        },
        {
            name: "bread",
            serving: 182,
            calories: 95,
            fat: 0.3,
            carbohydrates: 25
        }
    ]
    
    return (
        <>
            <NavBar/>
            <div className="analyzeMeal">
                <div className="searchBar"></div>
                <div className="nutritionalInfo">
                    <NutritionalInfo food={meals[0]}/>
                </div>
                <div className="additionalInfo"></div>
            </div>
        </> 
    )
}

export default AnalyzeMeal