// Speech related
let speech;
let speechIsAvailable = false;

let img;
let inputImage;
let base64;

let capture;


function preload(){
  //img = createImage(1024,1024); 
  //img = loadImage("http://aid-playground.hfg-gmuend.de:8655/txt2img?prompt=cat&cfg=1&steps=7");
}

function setup() {
  createCanvas(512, 512);
  capture = createCapture(VIDEO);
  capture.size(512, 512);
  capture.hide();

  speech = initSpeech();
}

let titleText = "";

function draw() {
  //image(img,0,0,width,height);
  image(capture, 0, 0, 512, 512);
  strokeWeight(3);
  stroke(255,0,0);
  fill(255,255,0);
  textSize(50);
  text(titleText, 50, 50);
}

async function mousePressed(){
  console.log("Try to Analyse ...")
  llmAnalyseImage(capture);
}

async function llmAnalyseImage(p5Img) {
  speech.stop();
  let inputImage = createImage(1024,1024);
  inputImage.copy(p5Img,0,0,1024,1024,0,0,1024,1024);
  inputImage.loadPixels();
  inputImage = inputImage.canvas.toDataURL();
  inputImage = inputImage.split(",");

  base64 = inputImage[1];


  const { response } = await post("http://172.17.11.18:8888/img/generate", {
    prompt: "Estimate the cost of that what you see it is a album cover. Name only the numerical number ending with the dollar sign",
    base64: base64,
  });

  if (response) {
    console.log(response);
    titleText = response;
    //speech.speak(response);
  }
}




// #############################################################
// ################# Vereinfachungsfunktionen ##################

function genImgWithControlNet(prompt, p5Img ){

}

async function post(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data;
}

function initSpeech(voice = "Aaron") {
  let speech = new p5.Speech(voice);
  speech.setLang("en-US");
  speech.interrupt = true;
  speech.cancel();
  speech.onStart = () => {
    console.log("Start Speeking")
  };
  speech.onEnd = () => {
    console.log("Stop Speeking")
  };

  return speech;
}