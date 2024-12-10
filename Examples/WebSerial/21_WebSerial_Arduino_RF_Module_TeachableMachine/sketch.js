// This example is also available online in the p5.js web editor:
// https://editor.p5js.org/gohai/sketches/X0XD9xvIR

let port;
let connectBtn;
let sendOnBtn;
let sendOffBtn;

function setup() {
  createCanvas(400, 400);
  background(220);

  port = createSerial();

  // in setup, we can open ports we have used previously
  // without user interaction

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }

  // any other ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)

  connectBtn = createButton('Connect to Arduino');
  connectBtn.position(40, 100);
  connectBtn.mousePressed(connectBtnClick);

  sendOnBtn = createButton('Send On');
  sendOnBtn.position(40, 200);
  sendOnBtn.mousePressed(sendOnBtnClick);

  sendOffBtn = createButton('Send Off');
  sendOffBtn.position(100, 200);
  sendOffBtn.mousePressed(sendOffBtnClick);
}

function draw() {
  // this makes received text scroll up
  copy(0, 0, width, height, 0, -1, width, height);

  // reads in complete lines and prints them at the
  // bottom of the canvas
  let str = port.readUntil("\n");
  if (str.length > 0) {
    text(str, 10, height-20);
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

function sendOnBtnClick() {
  port.write("on1\n");
}
function sendOffBtnClick() {
  port.write("off1\n");
}