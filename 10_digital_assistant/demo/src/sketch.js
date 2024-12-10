// @ts-check

// @ts-ignore
let canvas, chatbot;

let fg = FILL_GRAY;
let bg = FILL_GRAY_BACKGROUND;
let state = "";

// ############################# p5.js
function preload() {}

function setup() {
  noStroke();
  rectMode(CENTER);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed(onMousePress);
  canvas.doubleClicked(onDoubleClick);

  chatbot = new Chatbot("en-US", "Google US English");

  chatbot.onRecordingStart(() => {
    state = "Recording started";
    console.log("\n> " + state);

    fg = FILL_GREEN;
    bg = FILL_GREEN_BACKGROUND;
  });

  chatbot.onRecordingResult(() => {
    state = "Recording result";
    console.log("\n> " + state);

    console.log(chatbot.recording);
  });

  chatbot.onRecordingEnd(() => {
    state = "Recording ended";
    console.log("\n> " + state);

    fg = FILL_RED;
    bg = FILL_RED_BACKGROUND;
  });

  chatbot.onSpeechStart(() => {
    state = "Speech started";
    console.log("\n> " + state);
    console.log(chatbot.response);

    fg = FILL_GRAY;
    bg = FILL_GRAY_BACKGROUND;
  });

  chatbot.onSpeechEnd(() => {
    console.log("\n> " + state);
  });
}

function draw() {
  background(bg);

  let cx = windowWidth / 2;
  let cy = windowHeight / 2;
  let w = CIRCLE_SIZE;
  let h = CIRCLE_SIZE;

  if (chatbot.isProcessing) {
    // Make the circle pulse to indicate processing
    w = Math.sin(frameCount * 0.1) * 25 + CIRCLE_SIZE;
    h = Math.sin(frameCount * 0.1) * 25 + CIRCLE_SIZE;
  }

  fill(fg);
  ellipse(cx, cy, w, h);

  drawLegend();
}

// ############################# Events
function onMousePress() {
  console.log("\nsketch.js: Mouse pressed");
  // Request microphone access
  userStartAudio().then(() => {
    console.log("sketch.js: Microphone access granted");
  });
}

function onDoubleClick() {
  console.log("\nsketch.js: Double click");
  // Start recording and stop the current utterance
  chatbot.startRecording();
}
