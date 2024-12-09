function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

function drawBars() {
  let spectrum = fft.analyze();

  smoothSpectrum = smoothSpectrum.map((value, index) =>
    lerp(value, spectrum[index], 0.1)
  );

  // Get random samples from the spectrum
  let args = [];
  for (let i = 0; i < 1024; i += 8) {
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
