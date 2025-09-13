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

// Audio
const gameOverSound = new Sound([,0,925,.05,.3,.6,1,.3,,12,-100,.1,-0.06,,,.1]);
const music = new Music([[[1.8,0,72,,,.2,,4,-2,6,50,.15,,6],[,0,655,,,.09,3,1.65,,,,,.02,3.8,-.1,,.2],[1.2,0,23,,,.2,3,4,,,3,.9,.05],[1.5,0,740,,,.15,1,0,-.1,-.15,,.02,,,.12,,.06]],[[[3,-1,8,,,8,13,,13,,,,,,,,,,,,,,8,,,8,13,,13,,,,,,,,,,,,,,10,,,10,15,,15,,13,,15,,6,,15,,,8,6,5,3,5],[2,-1,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,]],[[3,-1,8,,,8,13,,13,,10,,15,,10,,15,,6,8,5,6,8,,,8,13,,13,,,,,,,,,,,,,,10,,,10,15,,15,,13,,15,,6,,15,,,8,6,5,3,5],[,1,25,,,,,,,,,,,,,25,,,,,,,,,,,,,25,,,25,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[2,-1,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,25,,13,,]]],[0],,{"title":"Oggy"}]);

// Wave data
var currentWaveIndex = 0;
// Inter-wave delay (in frames). 300 frames ~= 5 seconds at 60fps
var waveDelayFrames = 0;
var pendingNextWave = false;

// Deterministic waves definition: arrays of enemy positions per type
// Positions are tile coordinates [x, y]
var waves = [
    {
        sbires: [[4, 12], [screen_width-4,12]]
    },
    {
        sbires: [[4, 18], [screen_width-4,18]],
        magicians: [[10,10], [screen_width-10,10]],
    },
    {
        sbires: [[4, 12], [screen_width-4,12]],
        magicians: [[12,12], [screen_width-12,12]],
        mages: [[10,8], [screen_width-10,8]]
    },
    {
        magicians: [[8,8], [screen_width-8,8]],
        mages: [[6,16], [screen_width-6,16]],
        shooters: [[4,screen_height-4], [screen_width-4,screen_height-4]]
    },
    {
        magicians: [[10,6], [screen_width-10,6]],
        mages: [[10,18], [screen_width-10,18]],
        shooters: [[8,screen_height-4], [screen_width-8,screen_height-4]],
        wizards: [[screen_width/2,6]]
    },
    {
        magicians: [[6,12], [screen_width-6,12], [16,12]],
        mages: [[12,8], [screen_width-12,8], [12,16], [screen_width-12,16]],
        shooters: [],
        wizards: [[16,6], [16,18]]
    },
    {
        magicians: [[4,8], [screen_width-4,8]],
        mages: [[4,16], [screen_width-4,16]],
        shooters: [[8,screen_height-4], [screen_width-8,screen_height-4]],
        wizards: [[16,10], [16,14]]
    },
    {
        magicians: [[6,6], [screen_width-6,6], [6,18], [screen_width-6,18]],
        mages: [[8,8], [screen_width-8,8], [8,16], [screen_width-8,16]],
        shooters: [[16,screen_height-4], [16,screen_height-4]],
        wizards: [[4,12], [screen_width-4,12]]
    },
    {
        magicians: [[10,10], [screen_width-10,10], [10,14], [screen_width-10,14]],
        mages: [[16,8], [16,16]],
        shooters: [[6,12], [screen_width-6,12]],
        wizards: [[12,12], [screen_width-12,12]]
    },
    {
        magicians: [[4,12], [screen_width-4,12], [16,4], [16,20]],
        mages: [[8,6], [screen_width-8,6], [8,18], [screen_width-8,18]],
        shooters: [[6,14], [screen_width-6,14]],
        wizards: [[16,12]]
    }
];

// Additional enemies injected every N waves (keys are multiples of 10)
// Example structure: { 10: { magicians:[[x,y],...], mages:[], shooters:[], wizards:[] }, 20: { ... } }
var addEnemies = {
    10: {
        shooters: [[screen_width/2, screen_height-2]]
    },
    20: {
        shooters: [[screen_width/2, screen_height-2]],
        sbires: [[4,18], [screen_width-4,18],[8,18], [screen_width-8,18]]
    },
    30: {
        shooters: [[screen_width/2, screen_height-2]],
        wizards: [[16,6]]
    },
    40: {
        shooters: [[screen_width/2, screen_height-2]],
        magicians: [[16,6], [16,18]]
    },
    50: {
        shooters: [[screen_width/2, screen_height-2]],
        magicians: [[4,16], [screen_width-4,16]],
        wizards: [[16,6]]
    }
};