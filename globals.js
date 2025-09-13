// sound effects
const screen_width = 32;
const screen_height = 24;
const BEST_KEY = 'oggys_curse_bestScore';

// game variables
var player;
var witch;
var enemies = [];
var projectiles = [];
var witchSpells = [];
var mouses = [];
var score = 0;
var bestScore = 0;
var ap_oggys_curse_bestScore = 0;
var gameOver = false;
var inMenu = true;
var characterSize = vec2(1.5,1.5);

// Wave data
var currentWaveIndex = 0;
// Inter-wave delay (in frames). 300 frames ~= 5 seconds at 60fps
var waveDelayFrames = 0;
var pendingNextWave = false;

// Deterministic waves definition: arrays of enemy positions per type
// Positions are tile coordinates [x, y]
var waves = [
    {   // Wave 1 (gentle horizontal pair)
        magicians: [[12,8], [screen_width-12,8]],
        mages: [[16,6]],
        sbires: [[4, 12], [screen_width-4,12]],
        shooters: [[16,18]],
        wizards: []
    },
    {   // Wave 2 (balanced lanes)
        magicians: [[10,10], [screen_width-10,10]],
        mages: [[8,6], [screen_width-8,6]],
        shooters: [[6,16], [screen_width-6,16]],
        wizards: [[16,12]]
    },
    {   // Wave 3 (slightly denser, still fair)
        magicians: [[12,12], [screen_width-12,12]],
        mages: [[10,8], [screen_width-10,8]],
        shooters: [[8,18], [screen_width-8,18]],
        wizards: [[16,14]]
    },
    {   // Wave 4 (horizontal symmetry)
        magicians: [[8,8], [screen_width-8,8]],
        mages: [[6,16], [screen_width-6,16]],
        shooters: [[4,12], [screen_width-4,12]],
        wizards: []
    },
    {   // Wave 5 (quadrants)
        magicians: [[10,6], [screen_width-10,6]],
        mages: [[10,18], [screen_width-10,18]],
        shooters: [[8,4], [screen_width-8,4], [8,20], [screen_width-8,20]],
        wizards: []
    },
    {   // Wave 6 (cross and corners)
        magicians: [[6,12], [screen_width-6,12], [16,12]],
        mages: [[12,8], [screen_width-12,8], [12,16], [screen_width-12,16]],
        shooters: [],
        wizards: [[16,6], [16,18]]
    },
    {   // Wave 7 (rings)
        magicians: [[4,8], [screen_width-4,8]],
        mages: [[4,16], [screen_width-4,16]],
        shooters: [[8,12], [screen_width-8,12]],
        wizards: [[16,10], [16,14]]
    },
    {   // Wave 8 (outer box)
        magicians: [[6,6], [screen_width-6,6], [6,18], [screen_width-6,18]],
        mages: [[8,8], [screen_width-8,8], [8,16], [screen_width-8,16]],
        shooters: [[16,4], [16,20]],
        wizards: [[4,12], [screen_width-4,12]]
    },
    {   // Wave 9 (inner box)
        magicians: [[10,10], [screen_width-10,10], [10,14], [screen_width-10,14]],
        mages: [[16,8], [16,16]],
        shooters: [[6,12], [screen_width-6,12]],
        wizards: [[12,12], [screen_width-12,12]]
    },
    {   // Wave 10 (star)
        magicians: [[4,12], [screen_width-4,12], [16,4], [16,20]],
        mages: [[8,6], [screen_width-8,6], [8,18], [screen_width-8,18]],
        shooters: [[6,10], [screen_width-6,10], [6,14], [screen_width-6,14]],
        wizards: [[16,12]]
    }
];

// Additional enemies injected every N waves (keys are multiples of 10)
// Example structure: { 10: { magicians:[[x,y],...], mages:[], shooters:[], wizards:[] }, 20: { ... } }
var addEnemies = {
    10: {
        magicians: [[5,5], [screen_width-5,5]],
        mages: [[10,18], [screen_width-10,18]],
        shooters: [[4,4], [screen_width-4,4]],
        wizards: [[16,3], [16,21]]
    },
    20: {
        magicians: [[7,7], [screen_width-7,7], [7,17], [screen_width-7,17]],
        mages: [[12,6], [screen_width-12,6], [12,18], [screen_width-12,18]],
        shooters: [[6,10], [screen_width-6,10], [6,14], [screen_width-6,14]],
        wizards: [[16,6], [16,18]]
    },
    30: {
        magicians: [[6,12], [screen_width-6,12], [16,12]],
        mages: [[8,8], [screen_width-8,8], [8,16], [screen_width-8,16]],
        shooters: [[4,12], [screen_width-4,12], [16,4], [16,20]],
        wizards: [[12,12], [screen_width-12,12]]
    },
    40: {
        magicians: [[10,10], [screen_width-10,10], [10,14], [screen_width-10,14]],
        mages: [[6,6], [screen_width-6,6], [6,18], [screen_width-6,18]],
        shooters: [[8,4], [screen_width-8,4], [8,20], [screen_width-8,20]],
        wizards: [[16,8], [16,16]]
    },
    50: {
        magicians: [[4,8], [screen_width-4,8], [4,16], [screen_width-4,16], [16,12]],
        mages: [[10,6], [screen_width-10,6], [10,18], [screen_width-10,18]],
        shooters: [[6,12], [screen_width-6,12], [16,4], [16,20]],
        wizards: [[12,10], [screen_width-12,10], [12,14], [screen_width-12,14]]
    }
};