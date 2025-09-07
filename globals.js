// sound effects
const sound_click = new Sound([1,.5]);
const screen_width = 32;
const screen_height = 24;

// game variables
var player;
var witch;
var enemies = [];
var projectiles = [];
var mouses = [];
var score = 0;
var bestScore = 0;
var heal = 0;
var gameOver = false;
var inMenu = true;