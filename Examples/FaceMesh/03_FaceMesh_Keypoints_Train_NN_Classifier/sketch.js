// Interface
let dataButton;
let dataLabel;
let trainButton;
let saveButton;

let nn;

let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // Load the faceMesh model
  faceMesh = ml5.faceMesh(options);
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
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  //If a nn model is trained and a hand is detected show classification results
  if (faces.length > 0 && nn.isTrained) {
    let inputs = getInputs(faces[0]);
    nn.classify(inputs);
    textSize(20);
    text(nn.label,20,20);
  }
  
  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    let keypoint = face.keypoints[66];
    circle(keypoint.x, keypoint.y, 5);

    keypoint = face.keypoints[67];
    circle(keypoint.x, keypoint.y, 5);
    /*
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
    */
  }
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}


// Functions when ui Button is pressed

// add a Hand keypoint list example as training data
function addExampleButtonFunction(){
  if(faces.length > 0){
    nn.addExample(getInputs(faces[0]), dataLabel.value())
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

function getInputs(face) {
  let keypoints = face.keypoints;
  let inputs = [];

  inputs.push(keypoints[66].x);
  inputs.push(keypoints[66].y);
  inputs.push(keypoints[66].z);

  inputs.push(keypoints[67].x);
  inputs.push(keypoints[67].y);
  inputs.push(keypoints[67].z);

  /*
  for (let i = 0; i < keypoints.length; i++) {
    inputs.push(keypoints[i].x);
    inputs.push(keypoints[i].y);
    inputs.push(keypoints[i].z);
  }
    */
  return inputs;
}
