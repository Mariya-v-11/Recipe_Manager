from pydantic import BaseModel

class RecipeBase(BaseModel):
    title: str
    ingredients: str
    steps: str
    category: str
    tried: bool = False
    image: str = None  # Optional field

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: int

    class Config:
        orm_mode = True
