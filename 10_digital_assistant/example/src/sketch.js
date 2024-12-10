// @ts-check

// @ts-ignore
let canvas, chatbot;

let mic, fft;
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

  // @ts-expect-error Property 'AudioIn' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
  mic = new p5.AudioIn();
  // @ts-expect-error Property 'FFT' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
  fft = new p5.FFT(0.8, 1024);

  // @ts-ignore
  smoothSpectrum = new Array(fft?.bins || 1024).fill(0);

  canvas.doubleClicked(() => {
    // Start recording and stop the current utterance
    chatbot.startRecording();
    chatbot.circleSize = 50;
  });

  canvas.mousePressed(() => {
    // Request microphone access by explicitly clicking
    userStartAudio().then(() => {
      mic.start();
      mic.connect(fft);
    });
  });
}

function draw() {
  background(20);

  drawInterface();
  drawLegend();
}
