// sound effects
const sound_click = new Sound([1,.5]);
const screen_width = 48;
const screen_height = 32;

// game variables
var player;
let witch;
let enemies = [];
let projectiles = [];
let mouses = [];
let score = 0;
let bestScore = 0;
let heal = 0;
let gameOver = false;