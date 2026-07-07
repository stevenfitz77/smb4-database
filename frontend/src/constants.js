export const POSITIONS = [
  "SP", "RP", "SP/RP", "CP",
  "C", "1B", "2B", "3B", "SS", "IF", "LF", "CF", "RF", "OF"
];

export const PITCHER_POSITIONS = new Set(["SP", "RP", "SP/RP", "CP"]);

export const CHEMISTRY_TYPES = ["Competitive", "Spirited", "Disciplined", "Scholarly", "Crafty"];

export const PITCH_TYPES = ["4F", "2F", "CF", "CB", "SB", "SL", "CH", "FK"];

export const TRAIT_CHEMISTRY = {
  "Elite 2F": "Scholarly", "Elite 4F": "Scholarly", "Elite CB": "Scholarly",
  "Elite CF": "Scholarly", "Elite CH": "Scholarly", "Elite FK": "Scholarly",
  "Elite SB": "Scholarly", "Elite SL": "Scholarly", "Gets Ahead": "Scholarly",
  "Crossed Up": "Scholarly", "Falls Behind": "Scholarly", "Ace Exterminator": "Scholarly",
  "Big Hack": "Scholarly", "Bunter": "Scholarly", "Little Hack": "Scholarly", "Utility": "Scholarly",
  "Composed": "Disciplined", "Consistent": "Disciplined", "Metal Head": "Disciplined",
  "Volatile": "Disciplined", "BB Prone": "Disciplined", "Base Rounder": "Disciplined",
  "Fastball Hitter": "Disciplined", "High Pitch": "Disciplined",
  "Inside Pitch": "Disciplined", "Low Pitch": "Disciplined", "Magic Hands": "Disciplined",
  "Off-Speed Hitter": "Disciplined", "Outside Pitch": "Disciplined", "Pinch Perfect": "Disciplined",
  "Base Jogger": "Disciplined", "Butter Fingers": "Disciplined",
  "Durable": "Competitive", "K Collector": "Competitive", "Workhorse": "Competitive",
  "Injury Prone": "Competitive", "K Neglector": "Competitive", "Cannon Arm": "Competitive",
  "First Pitch Slayer": "Competitive", "Sprinter": "Competitive", "Stealer": "Crafty",
  "Tough Out": "Competitive", "First Pitch Prayer": "Competitive", "Noodle Arm": "Competitive",
  "Slow Poke": "Competitive", "Whiffer": "Competitive",
  "Pick Officer": "Crafty", "Reverse Splits": "Crafty", "Specialist": "Crafty",
  "Stimulated": "Crafty", "Easy Jumps": "Crafty", "Bad Ball Hitter": "Crafty",
  "Distractor": "Crafty", "Mind Gamer": "Crafty", "Sign Stealer": "Crafty",
  "Bad Jumps": "Crafty", "Easy Target": "Crafty", "Wild Thrower": "Crafty",
  "Clutch": "Spirited", "Dive Wizard": "Spirited", "Rally Stopper": "Spirited", "Two Way (C)": "Spirited",
  "Two Way (IF)": "Spirited", "Two Way (OF)": "Spirited", "Choker": "Spirited",
  "Meltdown": "Spirited", "Surrounded": "Spirited", "Wild Thing": "Spirited",
  "CON vs LHP": "Spirited", "CON vs RHP": "Spirited", "POW vs LHP": "Spirited",
  "POW vs RHP": "Spirited", "Rally Starter": "Spirited", "RBI Hero": "Spirited",
  "RBI Zero": "Spirited",
};

// Ordered worst-to-best, used for both validation and sort order
export const RATINGS = [
  "D-", "D", "D+",
  "C-", "C", "C+",
  "B-", "B", "B+",
  "A-", "A", "A+",
  "S"
];

export const THROW_HANDS = ["R", "L"];
export const BAT_HANDS = ["R", "L", "S"];

export const TWO_WAY_TRAITS = new Set(["Two Way (C)", "Two Way (IF)", "Two Way (OF)"]);