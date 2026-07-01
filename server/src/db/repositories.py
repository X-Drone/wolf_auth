from typing import List, Optional, TypeVar, Generic
from sqlalchemy.orm import Session

T = TypeVar('T')

class BaseRepository(Generic[T]):
    def __init__(self, db: Session, model: type[T]):
        self.db = db
        self.model = model
    
    def create(self, obj_in: dict) -> T:
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def get(self, id: int) -> Optional[T]:
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_all(self) -> List[T]:
        return self.db.query(self.model).all()
    
    def update(self, id: int, obj_in: dict) -> Optional[T]:
        obj = self.get(id)
        if obj:
            for key, value in obj_in.items():
                setattr(obj, key, value)
            self.db.commit()
            self.db.refresh(obj)
        return obj
    
    def delete(self, id: int) -> bool:
        obj = self.get(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False
    
    # Filter method
    def filter(self, **kwargs) -> List[T]:
        query = self.db.query(self.model)
        for attr, value in kwargs.items():
            query = query.filter(getattr(self.model, attr) == value)
        return query.all()