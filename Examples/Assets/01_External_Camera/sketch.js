let video;
let cameraId;

function setup() {
  createCanvas(640, 480);

  // Get a list of available video devices
  navigator.mediaDevices.enumerateDevices().then(devices => {
    let videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    if (videoDevices.length > 1) { // Assuming the external camera is the second one
      let constraints = {
        video: { deviceId: videoDevices[1].deviceId }
      };
      video = createCapture(constraints);
      video.size(640, 480);
      video.hide(); // Hide the raw video element
      cameraId = videoDevices[0].label
    } else {
      console.error("No external camera found.");
      video = createCapture(VIDEO);
      video.hide(); // Hide the raw video element
      cameraId = videoDevices[0].label
    }
    
    video.size(640, 480);

    navigator.mediaDevices.enumerateDevices().then(devices => {
      devices.forEach((device, index) => {
        if (device.kind === "videoinput") {
          console.log(`Camera ${index}: ${device.label} (ID: ${device.deviceId})`);
        }
      });
    }).catch(err => {
      console.error("Error accessing devices:", err);
    });
  });
}

function draw() {
  background(0);
  if (video) {
    image(video, 0, 0, width, height);
  }

  fill(255);
  stroke(30);
  strokeWeight(1);
  textSize(16);
  textAlign(LEFT, TOP);

  text("Camera: " + cameraId, 20, 20, width-40, height-40);
}