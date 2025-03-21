let textField;
let sendButton;
let LLM_response;
let storyText;
let LLM_is_processing = false;
let animation = 0;

let storyPrompt = "I'm writing a short bedtime story for children. \n\nFollowing Blake Snyder's Save The Cat method, write the Setup Scene for the story in just one paragraph of up to 100 words that: \n\n1) Shows the protagonist in their everyday life in a normal daily situation. \n2) Show where the protagonist live and give some details of that place and environment, like its name and characteristics. \n3) Hints at their wishes, desires and fears. \n4) Introduces their best friend and gives a sense of their relationship dynamic. \n\nThe setup scene should: \n\n1. Use a clear, concise and direct language. \n2. Imply a much larger narrative. \n3. Use concrete nouns and strong verbs. \n4. Avoid using too many adjectives and adverbs. \n5. Create a sense of tension or conflict. \n6. Do not be too direct: Imply the conflict rather than state it. \n7. Leave room for reader interpretation. \n8. Add an emotional undercurrent without being explicit. \n9. Avoid being wordy. Make it minimal, allowing the reader to infer the deeper meaning. \n10. Revolve around the theme introduced in the story details. \n\nUse vivid sensory details and bits of dialogue to bring the scene to life. The story should be about: ";

function preload(){
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //input Field for Chat
  textField = createInput('');
  textField.attribute('placeholder', 'What should be the story about?')
  textField.position(0, height-30);
  textField.size(width-100, 30);

  // Send chatmessage to local Ollama LLM
  sendButton = createButton('Start a story!');
  sendButton.size(100, 30);
  sendButton.position(width-100, height-30);
  sendButton.mousePressed(sendInputValueToLLM);

  //console.log(storyPrompt)
}

function draw() {
  background(0);
  
  if(!LLM_is_processing) // if the LLM has a response show it here:
  {
    fill(255);
    stroke(30);
    strokeWeight(1);
    textSize(16);
    textAlign(LEFT, TOP);

    storyText = LLM_response;
    text(storyText, 20, 20, width-40, height-40);
  
    // Text input is selected and ENTER pressed
    if (document.activeElement === textField.elt && keyIsDown(ENTER)) {
      sendInputValueToLLM();
    }

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


function sendInputValueToLLM() {

  let userInput = textField.value();
  console.log(storyPrompt + userInput)
  
  LLM_Text(storyPrompt + userInput);
  
  console.log("Waiting for response from LLM ...");
}

/*
{"model":"llama3.2:1b","messages":[{"role":"user","content":"hallo"},{"role":"assistant","content":"Hallo! Wie kann ich dir helfen?"},{"role":"user","content":"hallo"}],"stream":false}
*/



//#################################################
//#################################################

async function LLM_Text(txt) {

  LLM_is_processing = true;

  const { response } = await post("http://localhost:11434/api/generate", {
    model: "llama3.2:1b",
    //model: "llava-phi3",  
    prompt: txt,
    stream: false
  });
  
  if (response) {
    console.log(response);
    LLM_response = response;
  }

  LLM_is_processing = false;
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