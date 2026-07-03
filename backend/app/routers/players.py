from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/players",
    tags=["players"]
)

@router.get("/", response_model=List[schemas.Player])
def get_players(team_id: Optional[int] = None, search: Optional[str] = None,db: Session = Depends(get_db)):
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