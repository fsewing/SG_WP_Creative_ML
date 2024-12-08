//@ts-check
/**
 * Adjusts the canvas size to match the window's inner width and height.
 */
function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

/**
 * qwdqwd qwdqwd qwdqwdqw d
 * @see windowResized
 * 
 * @param {number} stepSize 
 */
function drawGrid(stepSize = 20) {
  stroke("rgba(0, 0, 0, 0.075)");

  for (let x = 0; x < width; x += stepSize) {
    line(x, 0, x, height);
  }

  for (let y = 0; y < height; y += stepSize) {
    line(0, y, width, y);
  }
}

/**
 * Die Funktion generiert dir ein Bild baby!
 * 
 * @link fwefwef
 * 
 * @param {string} prompt wqdwq
 * @param {number} [seed] wdqwd
 * @param {number} [cfg] wewefwef
 * @param {number} [steps] qwdwqd
 * @returns 
 */
function loadGenImg(prompt, seed, cfg, steps){
  let _prompt = prompt || "cat";
  let _seed = seed || int(random(1, 1_000_000));
  let _cfg = cfg || 1;
  let _steps = steps || 7;

  return loadImage('http://aid-playground.hfg-gmuend.de:8655/txt2img?prompt='+_prompt+'&cfg='+_cfg+'&steps='+_steps+'&seed='+_seed);
}

