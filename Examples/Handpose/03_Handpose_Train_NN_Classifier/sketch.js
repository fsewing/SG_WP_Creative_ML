/*

Example programm for classifying different hand poses.


*/

// Interface
let dataButton;
let dataLabel;
let trainButton;
let saveButton;

let nn;

let handPose;
let video;
let hands = [];

// A variable to track a pinch between thumb and index




function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  ml5.setBackend("webgl");
  
  //create a new neural net that can be trained
  nn = new NN();
  
  // dropdown menu to select the class whose hand poses are to be assigned
  dataLabel = createSelect();
  dataLabel.option('A');
  dataLabel.option('B');
  //dataLabel.option('C');
  //dataLabel.option('D');
  //... copy paste if you need more classes

  
  // create a Button 
  dataButton = createButton('add example');
  // assign the button to a function
  dataButton.mousePressed(addExampleButtonFunction);
  //... 
  trainButton = createButton('train model');
  trainButton.mousePressed(trainModelButtonFunction);
  //...
  saveButton = createButton('save trained Model');
  saveButton.mousePressed(saveModelButtonFunction);
  
  
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);
  
  //If a nn model is trained and a hand is detected show classification results
  if (hands.length > 0 && nn.isTrained) {
    let inputs = getInputs(hands[0]);
    nn.classify(inputs);
    textSize(20);
    text(nn.label,20,20);
  }
  
  // If there is at least one hand show keypoints
  if (hands.length > 0) {
    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
        for (let j = 0; j < hand.keypoints.length; j++) {
          let keypoint = hand.keypoints[j];
          fill(0, 255, 0);
          noStroke();
          circle(keypoint.x, keypoint.y, 10);
        }
    }
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}



// Functions when ui Button is pressed

// add a Hand keypoint list example as training data
function addExampleButtonFunction(){
  if(hands.length > 0){
    nn.addExample(getInputs(hands[0]), dataLabel.value())
  }
}

// Train the a model for classification
function trainModelButtonFunction(){
  nn.trainModel();
}

// Save the model as json file -> download
function saveModelButtonFunction(){
  nn.saveModel();
}

function getInputs(hand) {
    let keypoints = hand.keypoints;
    let inputs = [];
    for (let i = 0; i < keypoints.length; i++) {
      inputs.push(keypoints[i].x);
      inputs.push(keypoints[i].y);
    }
    return inputs;
  }