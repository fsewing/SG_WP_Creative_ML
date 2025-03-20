let textField;
let sendButton;
let messages = [];
let LLM_response;
let chatHistory;
let LLM_is_processing = false;
let animation = 0;

function preload(){
}

function setup() {
  createCanvas(512, 512);
  
  //input Field for Chat
  textField = createInput('');
  textField.attribute('placeholder', 'message to LLM')
  textField.position(0, height);
  textField.size(width-100);
  // Send chatmessage to local Ollama LLM
  sendButton = createButton('send to LLM');
  sendButton.size(100);
  sendButton.position(width-100, height);
  sendButton.mousePressed(sendInputValueToLLM);
}

function draw() {
  background(0,0,255);
  
  if(!LLM_is_processing) // if the LLM has an response show it here:
  {
    fill(255);
    stroke(30);
    strokeWeight(1);
    textSize(20);
    textAlign(LEFT, BOTTOM);
    for(let i = 0; i<messages.length; i++)
    {
      chatHistory = chatHistory + "\n" + messages[i].content;
    }

    text(chatHistory,20,20,width-20,height-20);
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


function sendInputValueToLLM(){
  let userMessage = textField.value();
  messages.push(
    {
      role: "user",
      content: userMessage
    }
  );
  LLM_Chat(messages);
  console.log("Waiting for response from LLM ...");
}

/*
{"model":"llama3.2:1b","messages":[{"role":"user","content":"hallo"},{"role":"assistant","content":"Hallo! Wie kann ich dir helfen?"},{"role":"user","content":"hallo"}],"stream":false}
*/



//#################################################
//#################################################


async function LLM_Chat(messagesHistory) {

  LLM_is_processing = true;

  const { message } = await post("http://localhost:11434/api/chat", {
    model: "llama3.2:1b",  
    messages: messagesHistory,
    stream: false
  });
  

  if (message) {
    console.log(message);

    LLM_response = message.content;
    messages.push(message);
    
  }else{
    console.log("No response ...");
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