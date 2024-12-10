/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates loading a pre-trained model with ml5.neuralNetwork.
 */

let classifier;
let handPose;
let video;
let faces = [];
let classification = "";
let isModelLoaded = false;

function preload() {
  // Load the FaceMesh model
  //handPose = ml5.handPose();
  faceMesh = ml5.faceMesh();
}

function setup() {
  createCanvas(640, 480);

  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // For this example to work across all browsers
  // "webgl" or "cpu" needs to be set as the backend
  ml5.setBackend("webgl");

  // Set up the neural network
  let classifierOptions = {
    task: "classification",
  };
  classifier = ml5.neuralNetwork(classifierOptions);
  
  const modelDetails = {
    model: "a-b-model/model.json",
    metadata: "a-b-model/model_meta.json",
    weights: "a-b-model/model.weights.bin",
  };

  classifier.load(modelDetails, modelLoaded);

  // Start the handPose detection
  //handPose.detectStart(video, gotHands);
  faceMesh.detectStart(video, gotFaces);

}

function draw() {
  //Display the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }

  // If the model is loaded, make a classification and display the result
  if (isModelLoaded && faces[0]) {
    let inputData = flattenFaceData();
    classifier.classify(inputData, gotClassification);
    textSize(64);
    fill(0, 255, 0);
    text(classification, 20, 60);
  }
}

// convert the handPose data to a 1D array
function flattenFaceData() {
  let face = faces[0];
  let faceData = [];
  for (let i = 0; i < face.keypoints.length; i++) {
    let keypoint = face.keypoints[i];
    faceData.push(keypoint.x);
    faceData.push(keypoint.y);
    faceData.push(keypoint.z);
  }
  return faceData;
}

// Callback function for when handPose outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

// Callback function for when the classifier makes a classification
function gotClassification(results) {
  classification = results[0].label;
}

// Callback function for when the pre-trained model is loaded
function modelLoaded() {
  isModelLoaded = true;
}
