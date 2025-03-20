let img;
let myprompt = "dog is sitting in a chrismas tree"
let speechRecording;
let base64;

// Load the image.
function preload() {
  generateImage(myprompt);
}

function setup(){
  createCanvas(400,400);

  speechRecording = new p5.SpeechRec("de-DE", onRecordingResult);
  speechRecording.continuous = true;
  speechRecording.interimResults = true;

  speechRecording.start();
}

function draw(){
  background(200);
  image(img, 0, 0, 400, 400);
}

function generateImage(prompt, base64) {
  img = loadImage('http://aid-playground.hfg-gmuend.de:8655/txt2img?prompt='+ prompt +'&cfg=1&steps=7');
  img = loadImage('http://aid-playground.hfg-gmuend.de:8655/txt2img?prompt='+ prompt +'&cfg=1&steps=7');

}

function onRecordingResult() {
  const keyword = speechRecording.resultString.split(" ").pop()?.toLowerCase();
  console.log("\n> sketch.js: Result found");
  console.log(keyword);

}


// http://aid-playground.hfg-gmuend.de:8655/txt2img?prompt=cat&cfg=1&steps=7