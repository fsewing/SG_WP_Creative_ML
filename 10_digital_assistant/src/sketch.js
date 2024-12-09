// @ts-check
let canvas;
let chatbot;

let mic, fft;
let currentSize = 50;
let smoothSpectrum = [];

let b1 = 50;
let b2 = 50;
let b3 = 50;
let b4 = 50;

function preload() {}

function setup() {
  noStroke();
  rectMode(CENTER);

  canvas = createCanvas(windowWidth, windowHeight);
  chatbot = new Chatbot("en-US", "Google US English");

  canvas.doubleClicked(() => {
    chatbot.speech.stop();
    chatbot.startSpeechRecognition();

    // Restart lerp animation
    currentSize = 50;
  });

  // @ts-expect-error Property 'AudioIn' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
  mic = new p5.AudioIn();
  // @ts-expect-error Property 'FFT' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
  fft = new p5.FFT(0.8, 1024);
  smoothSpectrum = new Array(fft?.bins || 1024).fill(0);

  canvas.mousePressed(() => {
    userStartAudio().then(() => {
      mic.start();
      mic.connect(fft);
    });
  });
}

function draw() {
  background(20);
  let vol = mic.getLevel();

  if (vol - 0 <= 1e-4) {
    if (frameCount % 180 === 0) console.error("No volume detected");
  }

  let sizeOffset = map(vol, 0, 1, 0, 550);
  let finalSize = CIRCLE_SIZE + sizeOffset;
  currentSize = lerp(currentSize, finalSize, 0.1);

  if (chatbot.mode === "user") {
    if (!chatbot.speechRecognitionEnded) {
      fill(195);
      ellipse(windowWidth / 2, windowHeight / 2, currentSize, currentSize);
    } else {
      fill(45);
      ellipse(windowWidth / 2, windowHeight / 2, CIRCLE_SIZE, CIRCLE_SIZE);
    }

    return;
  }

  fill(195);
  if (chatbot.mode === "assistant") {
    if (chatbot.isLoading) {
      currentSize = CIRCLE_SIZE + Math.sin(frameCount * 0.1) * 10;
      ellipse(windowWidth / 2, windowHeight / 2, currentSize, currentSize);
    } else {
      drawBars();
    }

    return;
  }
}
