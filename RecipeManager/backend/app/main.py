from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database, schemas, crud

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# ✅ VERY IMPORTANT: CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change to frontend URL for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ MAIN ROUTES:

@app.get("/recipes", response_model=list[schemas.Recipe])
def read_recipes(db: Session = Depends(get_db)):
    return crud.get_recipes(db)

@app.post("/recipes", response_model=schemas.Recipe)
def add_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    return crud.create_recipe(db, recipe)

@app.get("/search", response_model=list[schemas.Recipe])
def search_recipes(query: str, db: Session = Depends(get_db)):
    return crud.search_recipes(db, query)

@app.get("/suggest", response_model=list[schemas.Recipe])
def suggest_recipes(ingredients: str, db: Session = Depends(get_db)):
    all_recipes = crud.get_recipes(db)
    query_words = [word.strip().lower() for word in ingredients.split(",")]

    def matches(recipe):
        text = (recipe.ingredients + " " + recipe.title).lower()
        return any(word in text for word in query_words)

    return [r for r in all_recipes if matches(r)]

