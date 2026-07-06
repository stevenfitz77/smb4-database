from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, asc, desc
from typing import List, Optional

from .. import models, schemas
from ..database import get_db

SORTABLE_FIELDS = {
    "first_name": models.Player.first_name,
    "last_name": models.Player.last_name,
    "jersey_number": models.Player.jersey_number,
    "age": models.Player.age,
    "power": models.Player.power,
    "contact": models.Player.contact,
    "speed": models.Player.speed,
    "fielding": models.Player.fielding,
    "velocity": models.Player.velocity,
    "junk": models.Player.junk,
    "accuracy": models.Player.accuracy,
    # rating is not included here because SQL would try to sort it alphabetically.
    # rating sort will be handled in the frontend using RATINGS array
}

router = APIRouter(
    prefix="/players",
    tags=["players"]
)

@router.get("/", response_model=List[schemas.Player])
def get_players(
    team_id: Optional[int] = None,
    search: Optional[str] = None,
    position: Optional[str] = None,
    chemistry_type: Optional[str] = None,
    rating: Optional[str] = None,
    sort_by: Optional[str] = None,
    order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(models.Player)
    if team_id is not None:
        query = query.filter(models.Player.team_id == team_id)
    if search is not None:
        query = query.filter(
            or_(
                models.Player.first_name.ilike(f"%{search}%"),
                models.Player.last_name.ilike(f"%{search}%")
            )
        )
    if position is not None:
        query = query.filter(models.Player.primary_position == position)
    if chemistry_type is not None:
        query = query.filter(models.Player.chemistry_type == chemistry_type)
    if rating is not None:
        query = query.filter(models.Player.rating == rating)

    if sort_by in SORTABLE_FIELDS:
        column = SORTABLE_FIELDS[sort_by]
        query = query.order_by(desc(column) if order == "desc" else asc(column))

    return query.all()

@router.get("/{player_id}", response_model=schemas.Player)
def get_player(player_id: int, db: Session = Depends(get_db)):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player

@router.post("/", response_model=schemas.Player)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    new_player = models.Player(**player.model_dump())
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player

@router.put("/{player_id}", response_model=schemas.Player)
def update_player(player_id: int, updated_player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    for key, value in updated_player.model_dump().items():
        setattr(player, key, value)
    db.commit()
    db.refresh(player)
    return player

@router.delete("/{player_id}")
def delete_player(player_id: int, db: Session = Depends(get_db)):
    player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    db.delete(player)
    db.commit()
    return {"detail": f"Player {player_id} deleted"}