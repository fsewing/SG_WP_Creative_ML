let img;
let LLM_response;
let LLM_is_processing = false;
let animation = 0;

//let prompt = "Give a list of the objects that you see in this image. Do not describe the background. Give just a list of the objects, separated by commas.";
let prompt = "This is a drawing made by a kid. Describe shortly what do you see in the scene. Give your answer as a list, separated by commas.";
let imgName = "drawing-penguin.jpg";

function preload() {
  img = loadImage(imgName); // load an image
}

function setup() {
  createCanvas(512, 512);
}

function draw() {
  
  image(img, 0, 0, 512, 512, 0, 0, img.width, img.width, COVER); // draw the loaded image
  
  if(LLM_response) // if the LLM has an response show it here:
  {
    fill(255);
    stroke(30);
    strokeWeight(1);
    textSize(20);
    text(LLM_response,20,20,width-20,height-20);
  } // show the response END

  if(LLM_is_processing) // if the LLM is processing the request display a loading animation ... for fun
  {
    noFill();
    stroke(0,60);
    strokeWeight(50);
    push();
    translate(width/2, height/2);
    animation = animation + 0.1;
    if(animation%2 * 3.14 == 0){animation = 0}
    arc(0,0,width/2,width/2,animation/2,animation);
  } // loading animation END

}


function mousePressed(){
  
  // txt = "Count the red sticky notes in this picture.";
  // txt= "Write a very short story for Kids about this picture in the style of Arnold Schwarzenegger."

  LLM_Text_Image(prompt, img);
  console.log("Waiting for response from Ollama ...");
}




//#################################################
//#################################################


async function LLM_Text_Image(txt, img) {

  let inputImage = createImage(512,512);

  inputImage.copy(img,0,0,img.width,img.height, 0,0,512,512);
  inputImage.loadPixels();
  inputImage = inputImage.canvas.toDataURL();
  inputImage = inputImage.split(",");

  let base64 = inputImage[1];

  LLM_is_processing = true;

  const { response } = await post("http://localhost:11434/api/generate", {
    model: "llama3.2-vision",
    //model: "llava-phi3",  
    prompt: txt,
    images: [base64],
    stream: false,
  });
  

  if (response) {
    console.log(response);
    LLM_response = response;
  }
  LLM_is_processing = false;
  speech.cancel();
  speech.speak(LLM_response);
}


async function post(url, payload) {
  print(JSON.stringify(payload));
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

function onSpeechLoad() {
  console.log(filterByLanguage(speech.voices, "en-US"));
}

// ############################# Helpers
/**
 * This function filters the voices by language specification (ISO 639-1)
 * @param {SpeechSynthesisVoice[]} voices The voices to filter
 * @param {string} lang The language to filter by
 * @returns {SpeechSynthesisVoice[]} The filtered voices
 */
function filterByLanguage(voices, lang) {
  return voices.filter((voice) => voice.lang === lang);
}