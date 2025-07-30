// --- DOM elements ---
const randomBtn = document.getElementById("random-btn");
const recipeDisplay = document.getElementById("recipe-display");

// This function creates a list of ingredients for the recipe from the API data
function getIngredientsHtml(recipe) {
  let html = "";
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const meas = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) html += `<li>${meas ? `${meas} ` : ""}${ing}</li>`;
  }
  return html;
}

// This function displays the recipe on the page
function renderRecipe(recipe) {
  recipeDisplay.innerHTML = `
    <div class="recipe-title-row">
      <h2>${recipe.strMeal}</h2>
    </div>
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
    <h3>Ingredients:</h3>
    <ul>${getIngredientsHtml(recipe)}</ul>
    <h3>Instructions:</h3>
    <p>${recipe.strInstructions.replace(/\r?\n/g, "<br>")}</p>
  `;
}

// This function gets a random recipe from the API and shows it
async function fetchAndDisplayRandomRecipe() {
  recipeDisplay.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    const recipe = data.meals[0];
    renderRecipe(recipe);
  } catch (error) {
    recipeDisplay.innerHTML = "<p>Sorry, couldn't load a recipe.</p>";
    console.error(error);
  }
}

// --- Event listeners ---
randomBtn.addEventListener("click", fetchAndDisplayRandomRecipe);

// Optional: Load a recipe on page load
window.addEventListener("DOMContentLoaded", fetchAndDisplayRandomRecipe);
