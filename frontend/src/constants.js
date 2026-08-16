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
  "Injury Prone": "Competitive", "K Neglecter": "Competitive", "Cannon Arm": "Competitive",
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

export const CHEMISTRY_ICONS = {
  Competitive: '/chemistry-icons/competitive.png',
  Spirited: '/chemistry-icons/spirited.png',
  Disciplined: '/chemistry-icons/disciplined.png',
  Scholarly: '/chemistry-icons/scholarly.png',
  Crafty: '/chemistry-icons/crafty.png',
};

export const POSITION_SORT_ORDER = [
  "SP", "SP/RP", "RP", "CP",
  "C", "1B", "2B", "3B", "SS", "IF", "LF", "CF", "RF", "OF"
];

export const PLAYER_GROUPS = ['Standard', 'Legends', 'SMNL Customs'];

export const TRAIT_DESCRIPTIONS = {
  "Elite 2F": "",
  "Elite 4F": "",
  "Elite CB": "",
  "Elite CF": "",
  "Elite CH": "",
  "Elite FK": "",
  "Elite SB": "",
  "Elite SL": "",
  "Gets Ahead": "",
  "Crossed Up": "",
  "Falls Behind": "",
  "Ace Exterminator": "",
  "Big Hack": "",
  "Bunter": "",
  "Little Hack": "",
  "Utility": "",
  "Composed": "",
  "Consistent": "",
  "Metal Head": "",
  "Volatile": "",
  "BB Prone": "",
  "Base Rounder": "",
  "Fastball Hitter": "",
  "High Pitch": "",
  "Inside Pitch": "",
  "Low Pitch": "",
  "Magic Hands": "",
  "Off-Speed Hitter": "",
  "Outside Pitch": "",
  "Pinch Perfect": "",
  "Base Jogger": "",
  "Butter Fingers": "",
  "Durable": "",
  "K Collector": "",
  "Workhorse": "",
  "Injury Prone": "",
  "K Neglecter": "",
  "Cannon Arm": "",
  "First Pitch Slayer": "",
  "Sprinter": "",
  "Stealer": "",
  "Tough Out": "",
  "First Pitch Prayer": "",
  "Noodle Arm": "",
  "Slow Poke": "",
  "Whiffer": "",
  "Pick Officer": "",
  "Reverse Splits": "",
  "Specialist": "",
  "Stimulated": "",
  "Easy Jumps": "",
  "Bad Ball Hitter": "",
  "Distractor": "",
  "Mind Gamer": "",
  "Sign Stealer": "",
  "Bad Jumps": "",
  "Easy Target": "",
  "Wild Thrower": "",
  "Clutch": "Plus _/5/_ to all skills when pressure is high. The effect is doubled when pressure is extreme.",
  "Dive Wizard": "",
  "Rally Stopper": "",
  "Two Way (C)": "",
  "Two Way (IF)": "",
  "Two Way (OF)": "",
  "Choker": "",
  "Meltdown": "",
  "Surrounded": "",
  "Wild Thing": "",
  "CON vs LHP": "",
  "CON vs RHP": "",
  "POW vs LHP": "",
  "POW vs RHP": "",
  "Rally Starter": "",
  "RBI Hero": "",
  "RBI Zero": "",
};

export const SITE_NOTICE = "Content may take a minute to load after site inactivity | In Progress: Legends League & Arm Slot data uploads"
