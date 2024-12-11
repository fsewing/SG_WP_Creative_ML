// Auto1111 related
let auto1111;
let promptField;

// (Drawing) canvas related
let scribbleCanvas;
const CANVAS_SIZE = 512;

// Stable Diffusion related
const STABLE_DIFFUSION_URL = "https://dc8c99f7fe0e5a4511.gradio.live/";
const MODE_CANVAS = "showCanvas";
const MODE_IMAGE = "showImage";

function setup() {
  rectMode(CENTER);
  frameRate(60);

  // Main canvas (not for drawing, just for interacting)
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);

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


function draw() {

  if (auto1111.state === MODE_CANVAS) {
    // Draw the Scribble Image
    image(scribbleCanvas, 0, 0);

    fill(255, 255, 255);
    noStroke();
    circle(mouseX, mouseY, 5);

    // Only draw on the Scribble Canvas if Mosue is Pressed
    if (mouseIsPressed == true) {
      scribbleCanvas.fill(255);
      scribbleCanvas.strokeWeight(1);
      scribbleCanvas.stroke(255);
      scribbleCanvas.line(mouseX, mouseY, pmouseX, pmouseY);
    }
    // Show generated Image
  } else if (auto1111.state === MODE_IMAGE) {
    background(145);

    if (auto1111.img && auto1111.hasBase64) {
      image(auto1111.img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    } else {
      fill(20);
      textSize(16);
      textAlign(CENTER);
      text("No image generated yet", width / 2, height / 2);
    }
  }

  drawInfoText();
}


function drawMode() {
  
}
