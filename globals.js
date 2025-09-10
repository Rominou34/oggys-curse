// sound effects
const sound_click = new Sound([1,.5]);
const screen_width = 32;
const screen_height = 24;

// game variables
var player;
var witch;
var enemies = [];
var projectiles = [];
var witchSpells = [];
var mouses = [];
var score = 0;
var bestScore = 0;
var heal = 0;
var gameOver = false;
var inMenu = true;

// game mode and wave data
// gameMode can be 'random' or 'wave'
var gameMode = 'random';
var currentWaveIndex = 0;
// Deterministic waves definition: arrays of enemy positions per type
// Positions are tile coordinates [x, y]
var waves = [
    {   // Wave 1
        magicians: [[16,8], [12,4]],
        mages: [[8,6]],
        shooters: [[4,18]],
        wizards: []
    },
    {   // Wave 2
        magicians: [[20,10], [22,12]],
        mages: [[6,16], [10,14]],
        shooters: [[2,4], [28,18]],
        wizards: [[24,6]]
    },
    {   // Wave 3
        magicians: [[6,6], [26,6], [16,16]],
        mages: [[8,18], [24,18]],
        shooters: [[3,12], [29,12]],
        wizards: [[16,20]]
    }
];