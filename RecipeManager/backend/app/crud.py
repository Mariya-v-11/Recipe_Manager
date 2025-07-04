from sqlalchemy.orm import Session
from . import models, schemas

# Get all recipes
def get_recipes(db: Session):
    return db.query(models.Recipe).all()

# Create a new recipe
def create_recipe(db: Session, recipe: schemas.RecipeCreate):
    db_recipe = models.Recipe(**recipe.dict())
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

# Search recipes by title
def search_recipes(db: Session, query: str):
    return db.query(models.Recipe).filter(models.Recipe.title.contains(query)).all()
