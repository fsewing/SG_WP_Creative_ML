// This example is also available online in the p5.js web editor:
// https://editor.p5js.org/gohai/sketches/X0XD9xvIR

let port;
let connectBtn;

let classifier;
let video;
let label = "Model loading...";

let server_port = "5500" // the port of the live server
let imageModelURL = "http://127.0.0.1:"+server_port+"/Examples/WebSerial/21_WebSerial_Arduino_RF_Module_TeachableMachine/model/";

function preload() {
  ml5.setBackend('webgl');
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  classifier.classifyStart(video, gotResult);

  port = createSerial();

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }

  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(40, 480);
  connectBtn.mousePressed(connectBtnClick);
}

let lightIsOn = false;

function draw() {

  connectBtnStatus();

  image(video, 0, 0);
  textSize(50);

  if(label == "on" && lightIsOn == false){
    port.write("on1\n");
    lightIsOn = true;
  }
  if(label == "off" && lightIsOn == true){
    port.write("off1\n");
    lightIsOn = false;
  }
  if(label == "idle"){
    text("Need a Stiky Note!",50,100);
  }
  if(lightIsOn == true){
    text("On ..",50,50);
  }
  if(lightIsOn == false){
    text("Off ...",50,50);
  }
}

function gotResult(results) {
  // Update label variable which is displayed on the canvas
  label = results[0].label;
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open('MicroPython', 9600);
  } else {
    port.close();
  }
}

function connectBtnStatus(){
  // changes button label based on connection status
  if (!port.opened()) {
    connectBtn.html('Connect to Arduino');
  } else {
    connectBtn.html('Disconnect');
  }
}