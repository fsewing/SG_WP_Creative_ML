function drawInterface() {
  let vol = mic.getLevel();

  if (vol - 0 <= 1e-4) {
    if (frameCount % 180 === 0) console.error("No volume detected");
  }

  let sizeOffset = map(vol, 0, 1, 0, 550);
  let finalSize = CIRCLE_SIZE + sizeOffset;
  currentSize = lerp(currentSize, finalSize, 0.1);

  if (chatbot.mode === "user") {
    if (!chatbot.isListening) {
      fill(195);
      ellipse(windowWidth / 2, windowHeight / 2, currentSize, currentSize);
    } else {
      fill(45);
      ellipse(windowWidth / 2, windowHeight / 2, CIRCLE_SIZE, CIRCLE_SIZE);
    }

    return;
  }

  fill(195);
  if (chatbot.mode === "assistant") {
    if (chatbot.isProcessing) {
      currentSize = CIRCLE_SIZE + Math.sin(frameCount * 0.1) * 10;
      ellipse(windowWidth / 2, windowHeight / 2, currentSize, currentSize);
    } else {
      drawBars();
    }

    return;
  }
}

function drawBars() {
  let spectrum = fft.analyze();

  smoothSpectrum = smoothSpectrum.map((value, index) =>
    lerp(value, spectrum[index], 0.1)
  );

  // Get random samples from the spectrum
  let args = [];
  for (let i = 0; i < 1024; i += 64) {
    args.push(smoothSpectrum[i]);
  }
  let min = Math.min(...args);
  let max = Math.max(...args);

  args = args.map((x) => ~~map(x, max, min, -25, 180));

  b1 = lerp(b1, 95.5 + args[0], 0.875);
  b2 = lerp(b2, 95.5 + args[1], 0.875);
  b3 = lerp(b3, 95.5 + args[2], 0.875);
  b4 = lerp(b4, 95.5 + args[3], 0.875);

  let w = 70.5;
  let g = 6;

  rect(
    windowWidth / 2 - w * 1.5 - g * 2,
    windowHeight / 2,
    w,
    b1,
    Math.abs(b1 / 2)
  );
  rect(windowWidth / 2 - w / 2 - g, windowHeight / 2, w, b2, Math.abs(b2 / 2));
  rect(windowWidth / 2 + w / 2, windowHeight / 2, w, b3, Math.abs(b3 / 2));
  rect(
    windowWidth / 2 + w * 1.5 + g,
    windowHeight / 2,
    w,
    b4,
    Math.abs(b4 / 2)
  );
}

function drawLegend() {
  fill(225);
  textSize(12);

  text("Status: " + state, 20, 30);
  text("Mode: " + chatbot.mode || "Idle", 20, 50);

  text("Click once to allow access to the microphone", 20, windowHeight - 40);
  text("Click twice to restart the session", 20, windowHeight - 20);
}
