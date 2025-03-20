// ########################################## OLD ##########################################
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

// ########################################## NEW ##########################################
function initSpeech(voice = "Aaron") {
  let speech = new p5.Speech(voice);
  speech.setLang("en-US");
  speech.interrupt = true;
  speech.cancel();
  speech.onStart = () => {
    auto1111.isSpeaking = true;
  };
  speech.onEnd = () => {
    auto1111.isSpeaking = false;
  };

  return speech;
}

function initUI(listeners) {
  let promptField = createInput("");
  promptField.attribute("placeholder", "Cat walking on clouds");
  promptField.position(0, height + 60);
  promptField.size(width);

  promptField.height = 25;
  let totalHeight = height + promptField.height + 58;

  let generateImagebutton = createButton("Generate Image");
  generateImagebutton.position(0, totalHeight); // set the x y position of the Button -> button.position(x,y);
  generateImagebutton.mousePressed(listeners.generateImage); // Which function to be called if clicked

  let togglebutton = createButton("Toggle Canvas");
  togglebutton.position(generateImagebutton.width, totalHeight);
  togglebutton.mousePressed(listeners.toggleCanvas);

  let clearCanvasbutton = createButton("Clear Canvas");
  clearCanvasbutton.position(
    generateImagebutton.width + togglebutton.width,
    totalHeight
  );
  clearCanvasbutton.mousePressed(listeners.clearCanvas);

  return promptField;
}

async function generateImage() {
  auto1111.setSeed(random(0, 4294967294));

  auto1111.isGenerating = true;
  let base64 = await auto1111.txtToImg(
    promptField.value() || "...",
    scribbleCanvas,
    "canny"
  );
  // hasBase64 is needed for image display, only reset in double click
  auto1111.hasBase64 = true;
  auto1111.isGenerating = false;

  // Reset the state manually
  auto1111.state = MODE_IMAGE;

  auto1111.isAsking = true;
  const { response } = await post("http://172.17.11.18:8888/img/generate", {
    prompt: "Make a Christmas poem from the picture you see. with the theme of pairs. only eight lines.",
    base64,
  });
  auto1111.isAsking = false;

  if (response) {
    console.log(response);
    auto1111.resetBooleans();
    speech.speak(response);
  }
}

function infoText(str, autoSpeaks = false) {
  // Infotext so you know that Stable Diffusion is doing somthing
  push();
  translate(width / 2, height - 50);
  noStroke();
  fill(40);
  rect(0, 0, 200, 40, 45);
  fill(175);
  textAlign(CENTER);
  textSize(14);
  text(str, 0, 5);
  pop();

  if (speechIsAvailable && autoSpeaks) {
    speechIsAvailable = false;
    speech.speak(str);
  }
}

function toggleCanvas() {
  auto1111.state = auto1111.state === MODE_CANVAS ? MODE_IMAGE : MODE_CANVAS;
}

function clearCanvas() {
  scribbleCanvas.clear();
  scribbleCanvas.background(0);
}
