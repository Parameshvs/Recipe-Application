import { database } from "../config/firebaseConfig";
import { ref, set, get, remove, child, update, push } from "firebase/database";


export const addRecipe = async (recipe: { title: string, ingredients: string, steps: string }) => {
  try {
    const recipesRef = ref(database, 'recipes'); 
    const newRecipeRef = push(recipesRef);

   
    await set(newRecipeRef, {
      title: recipe.title,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    });

    console.log("Recipe added successfully");
    return newRecipeRef.key; 
  } catch (error) {
    console.error("Error adding recipe: ", error);
    throw error;
  }
};


export const fetchRecipes = async () => {
  try {
    const snapshot = await get(ref(database, 'recipes'));
    return snapshot.val();  
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Permission denied or network error");
  }
};


export const editRecipe = async (recipeId: string, updatedData: { title?: string, ingredients?: string, steps?: string }) => {
  try {
    const recipeRef = ref(database, 'recipes/' + recipeId);
    await update(recipeRef, updatedData);  
    console.log("Recipe updated successfully");
  } catch (error) {
    console.error("Error editing recipe: ", error);
  }
};


export const deleteRecipe = async (recipeId: string) => {
  try {
    const recipeRef = ref(database, 'recipes/' + recipeId);
    await remove(recipeRef);  
    console.log("Recipe deleted successfully");
  } catch (error) {
    console.error("Error deleting recipe: ", error);
  }
};
