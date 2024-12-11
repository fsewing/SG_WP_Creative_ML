function drawMode() {
  if (auto1111.state === MODE_CANVAS) {
    image(scribbleCanvas, 0, 0);

    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      let { x: handX, y: handY } = hand.index_finger_tip;
      let x = -(handX - video.width);
      let y = handY;

      fill(255, 255, 255);
      noStroke();
      circle(x, y, 10);

      // Only draw if the Shift key is not pressed
      if (keyIsDown(OPTION)) {
        scribbleCanvas.fill(255);
        scribbleCanvas.strokeWeight(1);
        scribbleCanvas.stroke(255);
        scribbleCanvas.line(x, y, px, py);
      }

      // Log the coordinates regardless of the key press
      px = x;
      py = y;
    }
  } else if (auto1111.state === MODE_IMAGE) {
    background(145);

    if (auto1111.img && auto1111.hasBase64) {
      image(auto1111.img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    } else {
      fill(20);
      textSize(16);
      textAlign(CENTER);
      text("No image generated yet", width / 2, height / 2);
    }
  }
}

function drawInfoText() {
  if (auto1111.isGenerating) {
    infoText("Generating image ...");
  }

  if (auto1111.isAsking) {
    infoText("Asking what it sees ...");
  }

  if (auto1111.isSpeaking) {
    infoText("Describing the image ...", true);
  }
}
