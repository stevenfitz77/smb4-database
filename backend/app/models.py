from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=True)
    abbreviation = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    players = relationship("Player", back_populates="team")

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    jersey_number = Column(Integer, nullable=True)
    card_photo_url = Column(String, nullable=True)
    traits = Column(JSON, nullable=True)      # list of trait names
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)  # nullable = free agents allowed
    team = relationship("Team", back_populates="players")

    primary_position = Column(String, nullable=False)
    secondary_positions = Column(JSON, nullable=True)  # list of secondary positions
    chemistry_type = Column(String, nullable=False)

    # universal stats
    power = Column(Integer, nullable=True)
    contact = Column(Integer, nullable=True)
    speed = Column(Integer, nullable=True)
    fielding = Column(Integer, nullable=True)

    # position players only
    arm = Column(Integer, nullable=True)

    # pitchers only
    velocity = Column(Integer, nullable=True)
    junk = Column(Integer, nullable=True)
    accuracy = Column(Integer, nullable=True)
    pitch_arsenal = Column(JSON, nullable=True) # list of 1-6 pitch types