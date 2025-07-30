// DOM elements
const randomBtn = document.getElementById("random-btn");
const recipeDisplay = document.getElementById("recipe-display");
const remixBtn = document.getElementById("remix-btn");
const remixTheme = document.getElementById("remix-theme");
const remixOutput = document.getElementById("remix-output");

let currentRecipe = null;

// Create ingredient list HTML from recipe data
function getIngredientsHtml(recipe) {
  let html = "";
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const meas = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) html += `<li>${meas ? `${meas} ` : ""}${ing}</li>`;
  }
  return html;
}

// Render recipe in DOM
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

// Fetch and show random recipe
async function fetchAndDisplayRandomRecipe() {
  recipeDisplay.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    const recipe = data.meals[0];
    currentRecipe = recipe;
    renderRecipe(recipe);
  } catch (err) {
    recipeDisplay.innerHTML = "<p>Sorry, couldn't load a recipe.</p>";
    console.error(err);
  }
}

// Remix the current recipe with a selected theme
async function remixRecipe() {
  if (!currentRecipe) {
    remixOutput.textContent = "Please load a recipe first!";
    return;
  }

  remixOutput.textContent = "Remixing...";

  const theme = remixTheme.value;
  const ingredientsList = getIngredientsHtml(currentRecipe).replace(/<[^>]+>/g, '').split('\n').join(', ');
  const instructions = currentRecipe.strInstructions;

  const prompt = `You are a fun and creative chef. Remix the following recipe using this theme: "${theme}". 
Keep it short, fun, and doable. Highlight changes to ingredients and instructions.

Original Ingredients: ${ingredientsList}
Original Instructions: ${instructions}

Remixed Recipe:`;


  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-3.5-turbo"
        messages: [
          { role: "system", content: "You are a creative recipe remixer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    remixOutput.textContent = reply;
  } catch (error) {
    remixOutput.textContent = "Sorry! Couldn't remix the recipe.";
    console.error(error);
  }
}

// Event listeners
randomBtn.addEventListener("click", fetchAndDisplayRandomRecipe);
remixBtn.addEventListener("click", remixRecipe);

// Load recipe on page load
window.addEventListener("DOMContentLoaded", fetchAndDisplayRandomRecipe);
