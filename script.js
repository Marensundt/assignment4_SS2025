/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
  return fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  .then((response) => response.json())
  .then((data) => {return data.meals[0]});
}

/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/
function displayMealData(meal) {
  //Henter ut id meal-conteiner fra div i HTML, og lager nye objekter 
  let container = document.getElementById("meal-container");

  let name = document.createElement('h2')
  name.innerHTML = meal.strMeal; 

  let image = document.createElement('img')
  image.src = meal.strMealThumb; 

  let category = document.createElement('p')
  category.innerHTML = 'Category: ' + meal.strCategory;

  let instuctions = document.createElement('p')
  instuctions.innerHTML = meal.strInstructions;

  // henter ut ingredienser og mål
  let inglist = document.createElement('ul')

  for(let i = 1; i < 20; i++) {
    if (!meal['strIngredient' + i]) {
      break
    }
    let li = document.createElement('li')
    li.innerHTML = meal['strMeasure' + i] + ' ' + meal['strIngredient' + i]
    inglist.append(li)
  }

  //Tar vekk teksten som står i diven meal-container i HTML dokumentet
  container.innerHTML = "";

  //Legger til elementene i conteiner
    container.append(name);
    container.append(image);
    container.append(category);
    container.append(inglist);
    container.append(instuctions);
}

/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || "cola";
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/
function fetchCocktailByDrinkIngredient(drinkIngredient) {
  return fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + drinkIngredient)
  .then((response) =>response.json())
  .then((data) => {return data.drinks[0]})
  .catch(() => {return fetchRandomCocktail()})
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
return fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
  .then((response) =>response.json())
  .then((data) => {return data.drinks[0]})
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) {
let container = document.getElementById('cocktail-container');

let name = document.createElement('h2')
name.innerHTML = cocktail.strDrink;

let image = document.createElement('img')
image.src = cocktail.strDrinkThumb;

let ingredients = document.createElement('ul')

for (let i = 1; i < 15; i++){
  if (!cocktail['strIngredient' + i]) {
    break
  }
  let li = document.createElement('li')
  li.innerHTML = cocktail['strMeasure' + i] + ' ' + cocktail['strIngredient' + i]
  ingredients.append(li)
}

let instructions = document.createElement('p')
instructions.innerHTML = cocktail.strInstructions;

container.innerHTML = "";

container.append(name)
container.append(image);
container.append(ingredients);
container.append(instructions);

}

/*
Call init() when the page loads
*/
window.onload = init;