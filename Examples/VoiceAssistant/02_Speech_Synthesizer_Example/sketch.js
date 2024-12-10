
let canvas;
let speech;

const SPEECH_TEXT =
  "OpenAI launched Sora, its text-to-video AI model. It was \
  released on Monday as part of its 12-day 'ship-mas' product \
  release series, as The Verge previously reported it would. \
  It's available today on Sora.com for ChatGPT subscribers in \
  the US and most other countries, and a new model, Sora \
  Turbo. This updated model adds features like generating video \
  from text, animating images, and remixing videos.";

// ############################# p5.js
function preload() {}

function setup() {
  noStroke();
  rectMode(CENTER);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.doubleClicked(onDoubleClick);

  // @ts-expect-error Property 'SpeechRec' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
  speech = new p5.Speech("Aaron", onSpeechLoad);
  speech.setLang("en-US");
}

function draw() {
  background(20);

  drawLegend();
}

// ############################# Events
function onDoubleClick() {
  console.log("\n> sketch.js: Double click");
  speech.cancel();
  speech.speak(SPEECH_TEXT);
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
