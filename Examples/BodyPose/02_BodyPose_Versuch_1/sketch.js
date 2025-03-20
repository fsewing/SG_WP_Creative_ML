/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates drawing skeletons on poses for the MoveNet model.
 */

let video;
let bodyPose;
let poses = [];
let connections;
let acc;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
  acc = loadImage("acc.png");
}

function setup() {
  createCanvas(640, 480);
  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);


  // Draw all the tracked landmark points
  let wrist_r_X = 0;
  let wrist_r_Y = 0;
  let wrist_l_X = 0;

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    let nase = pose.keypoints[0];

    wrist_r = pose.keypoints[10];
    fill(0, 255, 0);
    noStroke();
    circle(wrist_r.x, wrist_r.y, 10);
    wrist_l = pose.keypoints[9];

    wrist_r_X = pose.keypoints[9].x;
    wrist_r_Y = pose.keypoints[9].y;
    wrist_l_X = pose.keypoints[10].x;
    fill(0, 255, 0);
    noStroke();
    circle(wrist_r_X, wrist_r_Y, 10);

    let d = dist(wrist_r.x, wrist_r.y, wrist_l.x, wrist_l.y);


    

    textSize(d);
    console.log(d);
    text('😂', nase.x-d/2, nase.y);

    // for (let j = 0; j < pose.keypoints.length; j++) {
    //   let keypoint = pose.keypoints[j];
    //   // Only draw a circle if the keypoint's confidence is bigger than 0.1
    //   if (keypoint.confidence > 0.1) {
    //     fill(0, 255, 0);
    //     noStroke();
    //     //circle(keypoint.x, keypoint.y, 10);
    //     textSize(20);
    //     text(j, keypoint.x, keypoint.y);

    //   }
    // }
  }
}

// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}
