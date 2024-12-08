// @ts-check


function preload() {
  img = loadGenImg("Cat")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  drawGrid(20);
  image(img, 0, 0);

  ellipse(mouseX, mouseY, 100, 100);
}

function mousePressed(){
  i = i+1;
  img = loadGenImg("Axolotl", i);
}