// Constant Parameter
const TIME_STEP = 0.00045;
const DOT_SIZE = 2;
const COLS_COUNT = 50;
const ROWS_COUNT = 50;
const DOTS_COUNT = COLS_COUNT * ROWS_COUNT;
const MAX_VELOCITY = 2;
const MAX_ACCELERATION = 0.12;
const SWARM_COUNT = 120;
const NOISE_FACTOR = 4;

// State
var time = 0;
let dots = [];
let dots2 = [];
var COLORS;

class Dot {
    constructor(position, color) {
        this.position = position;
        this.previousPosition = null;
        this.acceleration = createVector();
        this.velocity = createVector();
        this.speedLimit = MAX_VELOCITY;
        this.forceLimit = MAX_ACCELERATION;
        this.color = color;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.speedLimit);
        this.previousPosition = createVector(this.position.x, this.position.y);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
        this.acceleration.limit(this.forceLimit);
    }
}

function computeCoordinates(i, map) {
    const x = Math.floor(i / map.rowsCount);

    const coords = {
        x: x,
        y: Math.floor(i - x * map.rowsCount),
    };

    return coords;
}

// Setup the stage.
function setup() {
    createCanvas(windowWidth, windowHeight);
    COLORS = [
        color('hsba(0, 74%, 92%, 0.1)'),
    ];

    for (let i = 0; i < SWARM_COUNT; ++i) {
        dots2.push(new Dot(createVector(random(width, height)), COLORS[0]));
    }

    background(0);
}

// Draw on every frame.
function draw() {
    dots = [];
    for (let i = 0; i < DOTS_COUNT; ++i) {
        const coords = computeCoordinates(i, { rowsCount: ROWS_COUNT });
        const angle = map(
            noise(coords.x / NOISE_FACTOR, coords.y / NOISE_FACTOR, time), 0, 1, 1 * QUARTER_PI, 1 * QUARTER_PI + TWO_PI
        );
        const thisVector = p5.Vector.fromAngle(angle);
        thisVector.setMag(random(1))
        dots.push(thisVector);
    }

    for (let i = 0; i < dots2.length; ++i) {
        const currentDot = dots2[i];

        followField(dots, currentDot);

        currentDot.update();

        showDot(currentDot);
        edges(currentDot);
    }

    // INCREMENT STAGE TIME.
    time += TIME_STEP;
}

function showDot(dot) {
    let xx2 = dot.position.x;
    let yy2 = dot.position.y;

    push();

    stroke(dot.color);
    strokeWeight(DOT_SIZE);
    line(dot.previousPosition.x, dot.previousPosition.y, xx2, yy2, DOT_SIZE, DOT_SIZE);
    pop();
}

function edges(dot) {
    if (dot.position.x < 0) {
        dot.position.x = width;
        dot.position.y = random(height);
    }
    if (dot.position.y > height) {
        dot.position.x = width;
        dot.position.y = random(height);
    }
    if (dot.position.x > width) {
        dot.position.x = random(width);
        dot.position.y = 0;
    }
    if (dot.position.y < 0) {
        dot.position.x = random(width);
        dot.position.y = height;
    }

    dot.color = COLORS[Math.floor(random(COLORS.length) * 10) % COLORS.length];
}

function followField(field, dot, index) {
    const x = Math.floor(dot.position.x / (width / COLS_COUNT));
    const y = Math.floor(dot.position.y / (height / ROWS_COUNT));

    if(field[x * COLS_COUNT + y]){
        dot.applyForce(field[x * COLS_COUNT + y]);
    }
}
// Resize to fullscreen when window is resized.
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}

// SUBSCRIBE
// LIKE
// SHARE