// @ts-check

let canvas;
let speechRecording;

const RECTANGLE = "rechteck";
const CIRCLE = "kreis";
const TRIANGLE = "dreieck";

let shape = "";

// ############################# p5.js
function preload() {}

function setup() {
  noStroke();
  rectMode(CENTER);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed(onMousePress);
  canvas.doubleClicked(onDoubleClick);

  // @ts-expect-error Property 'SpeechRec' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
  speechRecording = new p5.SpeechRec("de-DE", onRecordingResult);
  speechRecording.continuous = true;
  speechRecording.interimResults = true;

  speechRecording.start();
}

function draw() {
  background(20);
  let cx = windowWidth / 2;
  let cy = windowHeight / 2;

  fill(175);

  if (shape === RECTANGLE) {
    rect(cx, cy, 300, 300);
  } else if (shape === CIRCLE) {
    ellipse(cx, cy, 300);
  } else if (shape === TRIANGLE) {
    triangle(
      cx,
      cy - Math.sin(radians(90)) * 155,
      cx + Math.cos(radians(210)) * 155,
      cy - Math.sin(radians(210)) * 155,
      cx - Math.cos(radians(210)) * 155,
      cy - Math.sin(radians(210)) * 155
    );
  }

  drawLegend();
}

// ############################# Events
function onMousePress() {
  console.log("\n> sketch.js: Mouse pressed");
  // Request microphone access
  userStartAudio().then(() => {
    console.log("sketch.js: Microphone access granted");
  });
}

function onDoubleClick() {
  console.log("\n> sketch.js: Double click");
  speechRecording.start();
}

function onRecordingResult() {
  const keyword = speechRecording.resultString.split(" ").pop()?.toLowerCase();
  console.log("\n> sketch.js: Result found");
  console.log(keyword);

  if (keyword.indexOf(RECTANGLE) !== -1) {
    shape = RECTANGLE;
  } else if (keyword.indexOf(CIRCLE) !== -1) {
    shape = CIRCLE;
  } else if (keyword.indexOf(TRIANGLE) !== -1) {
    shape = TRIANGLE;
  } else {
    console.log("sketch.js: Unknown keyword detected");
  }
}
