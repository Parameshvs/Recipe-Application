
import React from "react";
import { editRecipe, deleteRecipe } from "../config/firebaseActions";

const RecipeActions = ({ recipe }: { recipe: any }) => {
  const handleDelete = () => {
    deleteRecipe(recipe.id);
  };

  const handleEdit = () => {
    const newTitle = prompt("New title:", recipe.title);
    const newIngredients = prompt("New ingredients:", recipe.ingredients);
    const newSteps = prompt("New steps:", recipe.steps);

    if (newTitle && newIngredients && newSteps) {
      editRecipe(recipe.id, { title: newTitle, ingredients: newIngredients, steps: newSteps });
    }
  };

  return (
    <div>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default RecipeActions;
