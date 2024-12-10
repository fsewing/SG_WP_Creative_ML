/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 * It detects two Pointingfingers and draws a line between them.
 * If they are close enought the line will be drawn on an canvas
 */

let handPose;
let video;
let hands = [];

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  //Extra Canvas auf dem wir zeichnen können
  canvas=createGraphics(width,height)
  canvas.clear();
  canvas.background(0);
  
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  
  tint(255, 100);
  // Draw the webcam video
  
  push();
    // Mirror video and canvas
    translate(width,0);
    scale(-1,1);
    image(video, 0, 0, width, height);
    image(canvas,0,0);
  pop();
  
  // Draw the webcam video
  //image(video, 0, 0, width, height);
  if(hands.length > 1){
    let hand_1_zeigefinger = hands[0].keypoints[8];
    let hand_2_zeigefinger = hands[1].keypoints[8];
    let d = dist(hand_1_zeigefinger.x,hand_1_zeigefinger.y, hand_2_zeigefinger.x,hand_2_zeigefinger.y);
    push();
      translate(width,0);
      scale(-1,1);
    
      if(d < 200){
        stroke(255);
      }else{
        stroke(255,255,25);
      }
      strokeWeight(2);
      line(hand_2_zeigefinger.x,hand_2_zeigefinger.y, hand_1_zeigefinger.x,hand_1_zeigefinger.y);
    pop();
    
    if(d < 200){
      //Zeichne in einen extra Canvas names canvas die Line
      canvas.fill(255,255,20);
      canvas.stroke(255)
      canvas.line(hand_2_zeigefinger.x,hand_2_zeigefinger.y, hand_1_zeigefinger.x,hand_1_zeigefinger.y);
    }
  }
  
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}
