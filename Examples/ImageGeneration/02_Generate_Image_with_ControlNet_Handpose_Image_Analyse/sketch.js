// Auto1111 related
let auto1111;
let promptField;

// ml5 related
let handPose;
let video;
let hands = [];

// Speech related
let speech;
let speechIsAvailable = false;

// (Drawing) canvas related
let scribbleCanvas;
let x, y, px, py;
const CANVAS_SIZE = 512;
const STABLE_DIFFUSION_URL = "https://dc8c99f7fe0e5a4511.gradio.live/";
const MODE_CANVAS = "showCanvas";
const MODE_IMAGE = "showImage";

// ######################################################## preload
function preload() {
  handPose = ml5.handPose();
}

// ######################################################## setup
function setup() {
  rectMode(CENTER);
  frameRate(60);

  // Main canvas (not for drawing, just for interacting)
  let cv = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  cv.doubleClicked(() => {
    speech.cancel();
    auto1111.resetBooleans(true);
    auto1111.state = MODE_CANVAS;

    auto1111.img = null;
    speechIsAvailable = false;
    clearCanvas();

    console.log("\n> sketch.js: Canvas reset");
  });

  // Initializing speech synthesizer and its events
  speech = initSpeech();

  // Initializing video capture and ml5 handpose detection
  video = createCapture(VIDEO);
  video.size(CANVAS_SIZE, CANVAS_SIZE);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, (results) => {
    hands = results;
  });

  // Initializing Auto1111 instance and getting scribble controlnet
  auto1111 = new Simple1111Api(STABLE_DIFFUSION_URL);
  auto1111.getControlnetInfo();

  // Initializing scribble canvas
  scribbleCanvas = createGraphics(width, height);
  scribbleCanvas.clear();
  scribbleCanvas.background(0);

  // Initializing user interface with its corresponding functions
  promptField = initUI({
    generateImage,
    toggleCanvas,
    clearCanvas,
  });
}

// ######################################################## draw
function draw() {
  drawMode();
  drawInfoText();
}
