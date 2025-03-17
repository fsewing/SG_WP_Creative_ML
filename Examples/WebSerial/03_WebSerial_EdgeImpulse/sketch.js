// This example is also available online in the p5.js web editor:
// https://editor.p5js.org/gohai/sketches/X0XD9xvIR

let port;
let connectBtn;

let active = "idle";

function setup() {
  createCanvas(400, 400);
  background(220);

  port = createSerial();

  // in setup, we can open ports we have used previously
  // without user interaction

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }

  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)

  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(40, 100);
  connectBtn.mousePressed(connectBtnClick);

}

function draw() {

  // reads in complete lines and prints them at the
  // bottom of the canvas
  let str = port.readUntil("\n").trim();
  console.log(str);
  if(str == "o") {
    active = "object";
  } else if(str == "idle") {
    active = "idle";
  }

  if(active == "object") {
    background(255, 0, 0);
    text("Object detected", 10, 10);
  } else {
    background(0,0,0);
  }


  // changes button label based on connection status
  if (!port.opened()) {
    connectBtn.html('Connect to Arduino');
  } else {
    connectBtn.html('Disconnect');
  }
}

function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}
