import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8000";

function App() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [category, setCategory] = useState("Veg");
  const [tried, setTried] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [availableIngredients, setAvailableIngredients] = useState("");
  const [activeCard, setActiveCard] = useState("add");
  const [showRecipes, setShowRecipes] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    axios.get(`${API_URL}/recipes`).then((res) => {
      setAllRecipes(res.data);
      setDisplayedRecipes([]);
      setShowRecipes(false);
    });
  };

  const clearDisplayed = () => {
    setDisplayedRecipes([]);
    setShowRecipes(false);
  };

  const handleCardChange = (card) => {
    setActiveCard(card);
    clearDisplayed();
  };

  const addRecipe = () => {
    axios
      .post(`${API_URL}/recipes`, {
        title,
        ingredients,
        steps: "N/A",
        category,
        tried,
        image: "",
      })
      .then((res) => {
        const updated = [...allRecipes, res.data];
        setAllRecipes(updated);
        setTitle("");
        setIngredients("");
        setCategory("Veg");
        setTried(false);
      });
  };

  const searchRecipes = () => {
    if (searchQuery.trim() === "") return;
    setShowRecipes(false);
    axios
      .get(`${API_URL}/search?query=${searchQuery}`)
      .then((res) => setDisplayedRecipes(res.data));
  };

  const suggestRecipes = () => {
    if (availableIngredients.trim() === "") return;
    setShowRecipes(false);
    axios
      .get(`${API_URL}/suggest?ingredients=${availableIngredients}`)
      .then((res) => setDisplayedRecipes(res.data));
  };

  const toggleTried = (id) => {
    const updated = displayedRecipes.map((r) =>
      r.id === id ? { ...r, tried: !r.tried } : r
    );
    setDisplayedRecipes(updated);
  };

  const applyFilter = (category) => {
    setShowRecipes(false);
    if (category === "All") {
      setDisplayedRecipes(allRecipes);
    } else {
      setDisplayedRecipes(allRecipes.filter((r) => r.category === category));
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterCategory(value);
    applyFilter(value);
  };

  const handleShowSaved = () => {
    setDisplayedRecipes(allRecipes);
    setShowRecipes(true);
  };

  return (
    <div className="app bg-basic" style={{ textAlign: "center", backgroundColor: "#f4f6fa", minHeight: "100vh", padding: "20px 0" }}>
      <div className="container card-style" style={{ maxWidth: "800px", margin: "auto", fontSize: "1.2rem" }}>
        <h1 className="title" style={{ fontSize: "2.5rem" }}>🍽️ Recipe Manager</h1>

        <div className="card-grid nav-buttons" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          <button className={activeCard === "add" ? "active" : ""} onClick={() => handleCardChange("add")}>➕ Add</button>
          <button className={activeCard === "search" ? "active" : ""} onClick={() => handleCardChange("search")}>🔍 Search</button>
          <button className={activeCard === "suggest" ? "active" : ""} onClick={() => handleCardChange("suggest")}>🤖 Suggest</button>
          <button className={activeCard === "filter" ? "active" : ""} onClick={() => handleCardChange("filter")}>📂 Filter</button>
          <button onClick={handleShowSaved}>📋 Show Recipes</button>
        </div>

        {activeCard === "add" && (
          <div className="section" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", marginTop: "20px" }}>
            <h2>Add Recipe</h2>
            <input style={{ width: "100%", padding: "10px" }} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea style={{ width: "100%", padding: "10px" }} placeholder="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
            <select style={{ width: "100%", padding: "10px" }} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Dessert">Dessert</option>
            </select>
            <label>
              <input type="checkbox" checked={tried} onChange={(e) => setTried(e.target.checked)} /> Tried
            </label>
            <button onClick={addRecipe}>Add</button>
          </div>
        )}

        {activeCard === "search" && (
          <div className="section">
            <h2>Search Recipes</h2>
            <input placeholder="Search by title" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={searchRecipes}>Search</button>
          </div>
        )}

        {activeCard === "suggest" && (
          <div className="section">
            <h2>Suggest Recipes</h2>
            <input placeholder="Ingredients (e.g. paneer, rice)" value={availableIngredients} onChange={(e) => setAvailableIngredients(e.target.value)} />
            <button onClick={suggestRecipes}>Suggest</button>
          </div>
        )}

        {activeCard === "filter" && (
          <div className="section">
            <h2>Filter by Category</h2>
            <select value={filterCategory} onChange={handleFilterChange}>
              <option value="All">All</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>
        )}

        {(displayedRecipes.length > 0 || showRecipes) && (
          <div className="section">
            <h2>{showRecipes ? "Saved Recipes" : "Results"}</h2>
            {displayedRecipes.length === 0 ? (
              <p style={{ fontSize: "1.2rem", color: "gray" }}>No matching recipes found.</p>
            ) : (
              <div className="recipe-list" style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
                {displayedRecipes.map((recipe) => (
                  <div className="card-style recipe-card" key={recipe.id} style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "10px", background: "#f9f9f9" }}>
                    <h3>{recipe.title}</h3>
                    <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                    <p><strong>Category:</strong> {recipe.category}</p>
                    <p>
                      <strong>Status:</strong> <span className={recipe.tried ? "tried" : "not-tried"} onClick={() => toggleTried(recipe.id)}>
                        {recipe.tried ? "✅ Tried" : "🕓 To Try"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
