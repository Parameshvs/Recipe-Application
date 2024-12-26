import React, { useEffect, useState } from "react";
import { fetchRecipes, addRecipe, editRecipe, deleteRecipe } from "../config/firebaseActions";

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [search, setSearch] = useState(""); 
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    steps: "",
  });
  const [isEditing, setIsEditing] = useState(false); 
  const [currentEditRecipe, setCurrentEditRecipe] = useState({
    id: "",
    title: "",
    ingredients: "",
    steps: "",
  });

 
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipes = await fetchRecipes();
        if (recipes) {
          const recipeList = Object.keys(recipes).map((key) => ({
            id: key,
            ...recipes[key],
          }));
          setRecipes(recipeList);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    loadRecipes();
  }, []);


  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRecipeId = await addRecipe(newRecipe); 
      const addedRecipe = { id: newRecipeId, ...newRecipe }; 
      setRecipes((prev) => [...prev, addedRecipe]); 
      setNewRecipe({ title: "", ingredients: "", steps: "" }); 
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

 
  const handleDelete = async (id: string) => {
    try {
      await deleteRecipe(id); 
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id)); 
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleEdit = (recipe: any) => {
    setIsEditing(true);
    setCurrentEditRecipe({
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    });
  };

 
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editRecipe(currentEditRecipe.id, {
        title: currentEditRecipe.title,
        ingredients: currentEditRecipe.ingredients,
        steps: currentEditRecipe.steps,
      });
      setRecipes((prev) =>
        prev.map((recipe) =>
          recipe.id === currentEditRecipe.id ? currentEditRecipe : recipe
        )
      );
      setIsEditing(false);
      setCurrentEditRecipe({
        id: "",
        title: "",
        ingredients: "",
        steps: "",
      });
    } catch (error) {
      console.error("Error editing recipe:", error);
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
     
      <div>
        <input
          type="text"
          placeholder="Search recipes by title or ingredients"
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      <h3>Add a New Recipe</h3>
      <form onSubmit={handleAddRecipe}>
        <input
          type="text"
          placeholder="Recipe Title"
          value={newRecipe.title}
          onChange={(e) =>
            setNewRecipe({ ...newRecipe, title: e.target.value })
          }
        />
        <textarea
          placeholder="Ingredients"
          value={newRecipe.ingredients}
          onChange={(e) =>
            setNewRecipe({ ...newRecipe, ingredients: e.target.value })
          }
        />
        <textarea
          placeholder="Steps"
          value={newRecipe.steps}
          onChange={(e) =>
            setNewRecipe({ ...newRecipe, steps: e.target.value })
          }
        />
        <button type="submit">Add Recipe</button>
      </form>

     
      {isEditing && (
        <div>
          <h3>Edit Recipe</h3>
          <form onSubmit={handleSaveEdit}>
            <input
              type="text"
              placeholder="Recipe Title"
              value={currentEditRecipe.title}
              onChange={(e) =>
                setCurrentEditRecipe({
                  ...currentEditRecipe,
                  title: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Ingredients"
              value={currentEditRecipe.ingredients}
              onChange={(e) =>
                setCurrentEditRecipe({
                  ...currentEditRecipe,
                  ingredients: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Steps"
              value={currentEditRecipe.steps}
              onChange={(e) =>
                setCurrentEditRecipe({
                  ...currentEditRecipe,
                  steps: e.target.value,
                })
              }
            />
            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}

    
      <h3>Recipe List</h3>
      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <div key={recipe.id}>
            <h4>{recipe.title}</h4>
            <p>{recipe.ingredients}</p>
            <p>{recipe.steps}</p>
            <button onClick={() => handleEdit(recipe)}>Edit</button>
            <button onClick={() => handleDelete(recipe.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No recipes found</p>
      )}
    </div>
  );
};

export default RecipeList;
