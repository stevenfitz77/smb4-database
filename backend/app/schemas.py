from pydantic import BaseModel, field_validator, model_validator
from typing import Optional, List, Dict

VALID_POSITIONS = {
    "SP", "RP", "SP/RP", "CP", "C", "1B", "2B", "3B", "SS", "IF", "LF", "CF", "RF", "OF"
}

PITCHER_POSITIONS = {"SP", "RP", "SP/RP", "CP"}
VALID_PITCHES = {"4F", "2F", "CF", "CH", "SL", "CB", "SB", "FK"}

VALID_CHEMISTRY_TYPES = {"Competitive", "Spirited", "Disciplined", "Scholarly", "Crafty"}
TRAIT_CHEMISTRY = {
    # Scholarly
    "Elite 2F": "Scholarly", "Elite 4F": "Scholarly", "Elite CB": "Scholarly",
    "Elite CF": "Scholarly", "Elite CH": "Scholarly", "Elite FK": "Scholarly",
    "Elite SB": "Scholarly", "Elite SL": "Scholarly", "Gets Ahead": "Scholarly",
    "Crossed Up": "Scholarly", "Falls Behind": "Scholarly", "Ace Exterminator": "Scholarly",
    "Big Hack": "Scholarly", "Bunter": "Scholarly", "Little Hack": "Scholarly", "Utility": "Scholarly",

    # Disciplined
    "Composed": "Disciplined", "Consistent": "Disciplined", "Metal Head": "Disciplined",
    "Volatile": "Disciplined", "BB Prone": "Disciplined", "Base Rounder": "Disciplined",
    "Dive Wizard": "Disciplined", "Fastball Hitter": "Disciplined", "High Pitch": "Disciplined",
    "Inside Pitch": "Disciplined", "Low Pitch": "Disciplined", "Magic Hands": "Disciplined",
    "Off-Speed Hitter": "Disciplined", "Outside Pitch": "Disciplined", "Pinch Perfect": "Disciplined",
    "Base Jogger": "Disciplined", "Butter Fingers": "Disciplined",

    # Competitive
    "Durable": "Competitive", "K Collector": "Competitive", "Workhorse": "Competitive",
    "Injury Prone": "Competitive", "K Neglector": "Competitive", "Cannon Arm": "Competitive",
    "First Pitch Slayer": "Competitive", "Sprinter": "Competitive", "Stealer": "Competitive",
    "Tough Out": "Competitive", "First Pitch Prayer": "Competitive", "Noodle Arm": "Competitive",
    "Slow Poke": "Competitive", "Whiffer": "Competitive",

    # Crafty
    "Pick Officer": "Crafty", "Reverse Splits": "Crafty", "Specialist": "Crafty",
    "Stimulated": "Crafty", "Easy Jumps": "Crafty", "Bad Ball Hitter": "Crafty",
    "Distractor": "Crafty", "Mind Gamer": "Crafty", "Sign Stealer": "Crafty",
    "Bad Jumps": "Crafty", "Easy Target": "Crafty", "Wild Thrower": "Crafty",

    # Spirited
    "Clutch": "Spirited", "Rally Stopper": "Spirited", "Two Way (C)": "Spirited",
    "Two Way (IF)": "Spirited", "Two Way (OF)": "Spirited", "Choker": "Spirited",
    "Meltdown": "Spirited", "Surrounded": "Spirited", "Wild Thing": "Spirited",
    "CON vs LHP": "Spirited", "CON vs RHP": "Spirited", "POW vs LHP": "Spirited",
    "POW vs RHP": "Spirited", "Rally Starter": "Spirited", "RBI Hero": "Spirited",
    "RBI Zero": "Spirited",
}


# ---------- Team ----------

class TeamBase(BaseModel):
    name: str
    city: Optional[str] = None
    abbreviation: str
    stadium_name: str
    logo_url: Optional[str] = None

    @field_validator("abbreviation")
    @classmethod
    def abbreviation_format(cls, value):
        if not (2 <= len(value) <= 4):
            raise ValueError("Abbreviation must be between 2 and 4 characters")
        return value.upper()

class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int

    class Config:
        from_attributes = True


# ---------- Player ----------

class PlayerBase(BaseModel):
    first_name: str
    last_name: str
    jersey_number: Optional[int] = None
    card_photo_url: Optional[str] = None
    traits: Optional[List[str]] = None
    team_id: Optional[int] = None

    primary_position: str
    secondary_positions: Optional[List[str]] = None
    chemistry_type: str

    power: Optional[int] = None
    contact: Optional[int] = None
    speed: Optional[int] = None
    fielding: Optional[int] = None

    arm: Optional[int] = None

    velocity: Optional[int] = None
    junk: Optional[int] = None
    accuracy: Optional[int] = None
    pitch_arsenal: Optional[List[str]] = None

    # ---- Field Validators ----
    @field_validator("power", "contact", "speed", "fielding", "arm", "velocity", "junk", "accuracy")
    @classmethod
    def stat_in_range(cls, value):
        if value is not None and not (0 <= value <= 99):
            raise ValueError("Stat values must be between 0 and 99")
        return value
    
    @field_validator("primary_position")
    @classmethod
    def validate_primary_position(cls, value):
        if value not in VALID_POSITIONS:
            raise ValueError("Valid Primary Positions: SP, RP, SP/RP, CP, C, 1B, 2B, 3B, SS, LF, CF, RF")
        return value
    
    @field_validator("secondary_positions")
    @classmethod
    def validate_secondary_positions(cls, value):
        if value is None:
            return value
        if len(value) > 2:
            raise ValueError("A player can have at most 2 secondary positions")
        for pos in value:
            if pos not in VALID_POSITIONS:
                raise ValueError(f"Valid Secondary Positions: {VALID_POSITIONS}")
        return value
    
    @field_validator("pitch_arsenal")
    @classmethod
    def validate_pitch_arsenal(cls, value):
        if value is None:
            return value
        if not (1 <= len(value) <= 6):
            raise ValueError("Pitch arsenal must contain between 1 and 6 pitch types")
        for pitch in value:
            if pitch not in VALID_PITCHES:
                raise ValueError(f"Valid Pitch Types: {VALID_PITCHES}")
        return value
    
    @field_validator("chemistry_type")
    @classmethod
    def validate_chemistry_type(cls, value):
        if value not in VALID_CHEMISTRY_TYPES:
            raise ValueError(f"Valid Chemistry Types: {VALID_CHEMISTRY_TYPES}")
        return value
    
    @field_validator("traits")
    @classmethod
    def validate_traits(cls, value):
        if value is None:
            return value
        if len(value) > 2:
            raise ValueError("A player can have at most 2 traits")
        for trait in value:
            if trait not in TRAIT_CHEMISTRY:
                raise ValueError(f"Invalid trait: {trait}")
        return value
    
    # ---- Model Validators: pitcher vs position player ----
    @model_validator(mode="after")
    def check_role_specific_fields(self):
        is_pitcher = self.primary_position in PITCHER_POSITIONS

        if is_pitcher:
            missing = [f for f in ("velocity", "junk", "accuracy", "pitch_arsenal")
                       if getattr(self, f) is None]
            if missing:
                raise ValueError(f"Pitchers must have the following fields: {missing}")
            if self.arm is not None:
                raise ValueError("Pitchers should not have an 'arm' stat")
        else:
            if self.arm is None:
                raise ValueError("Position players must have an 'arm' stat")
            filled = [f for f in ("velocity", "junk", "accuracy", "pitch_arsenal")
                      if getattr(self, f) is not None]
            
            if filled:
                raise ValueError(f"Position players should not have the following fields: {filled}")
            
        return self
    
    
class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    team: Optional[Team] = None

    class Config:
        from_attributes = True
