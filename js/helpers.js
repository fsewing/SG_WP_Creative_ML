//@ts-check
/**
 * Adjusts the canvas size to match the window's inner width and height.
 */
// function windowResized() {
//   resizeCanvas(innerWidth, innerHeight);
// }

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


/////////////////////
// Bildgenerierung

/**
 * The function generates an image via aid-playground.hfg-gmuend.de/txt2img and loads it as a p5 image!
 * 
 * @link aid-playground.hfg-gmuend.de/txt2img
 * 
 * @param {string} prompt Your prompt or text description for the image to be generated.
 * @param {number} [cfg] CFG Influences the extent to which the model should adhere to the image description. Standard value: 1
 * @param {number} [steps] How many steps the start noise should be denoised. Standard value: 7
 * @param {number} [seed] Start noise for the image generator. Standard value: Random Number between 1 and 1.000.000
 * @returns 
 */
function loadGenImg(prompt, cfg, steps, seed){
  let _prompt = prompt || "cat";
  let _seed = seed || int(random(1, 1_000_000));
  let _cfg = cfg || 1;
  let _steps = steps || 7;

  return loadImage('http://aid-playground.hfg-gmuend.de:8655/txt2img?prompt='+_prompt+'&cfg='+_cfg+'&steps='+_steps+'&seed='+_seed);
}

// Bildgenerierung
/////////////////////


/////////////////////
// Chatbot Anfang


function normalizeArray(arr) {
  let minVal = Math.min(...arr);
  let maxVal = Math.max(...arr);
  return arr.map((x) => (x - minVal) / (maxVal - minVal));
}

/**
 * @param {string} arg The message to be displayed in the console
 * @param {[number, number, number]} [color] The rgb color specification to be used in the console
 */
function info(arg, color = [81, 142, 255]) {
  console.log(
    `%c${arg}`,
    `color: rgba(${color.toString()}, 1); font-weight: bold; background-color: rgba(${color.toString()}, .075); padding: 5px; border-radius: 5px; padding: 5px;`
  );
}

/**
 * @param {string} url The endpoint of the API
 * @param {object} payload The main data to be sent within the body attribute of the request
 */
async function post(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data;
}

// Chatbot Ende
/////////////////////