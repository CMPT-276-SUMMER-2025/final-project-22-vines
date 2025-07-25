export function getTotalNutrients(ingredients) {
    let totalNutrients = {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0
    };

    for (let i = 0; i < ingredients.length; i++) {
        calories += ingredients[i].parsed[0].nutrients.ENERC_KCAL.quantity;
        protein += ingredients[i].parsed[0].nutrients.PROCNT.quantity;
        carbohydrates += ingredients[i].parsed[0].nutrients.CHOCDF.quantity;
        fat += ingredients[i].parsed[0].nutrients.FAT.quantity;
    }

    return totalNutrients;
}