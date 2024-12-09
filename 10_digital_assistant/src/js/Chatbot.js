class Chatbot {
  /**
   * @param {string} The language of the chatbot. It follows the ISO 639-1 standard, for instance 'en-US' or 'es-ES'.
   */
  lang;
  /**
   * @type {string} The voice URL of the audio speech. For instance, it can be 'Google Deutsch' or 'Google US English'.
   */
  voice;
  /**
   * @type {string} The model name as specified by ollama. By default, it is 'mistral:latest', a 7B model.
   */
  model;
  /**
   * @type {p5.SpeechRec} The speech recognizer object.
   * @link https://github.com/IDMNYU/p5.js-speech?tab=readme-ov-file#p5speechrec
   */
  speechRecognition;
  /**
   * @type {p5.Speech} The speech synthesizer object.
   * @link https://github.com/IDMNYU/p5.js-speech?tab=readme-ov-file#p5speech-1
   */
  speech;
  /**
   * @type {boolean} Indicates whether the recording has been completely turned off. After that, the chatbot has to be restarted.
   * @readonly
   */
  speechRecognitionEnded;
  /**
   * @type {boolean} Indicates whether the speech speech has finished
   * @readonly
   */
  speechEnded;
  /**
   * @type {string} The system message to be sent to the AI
   */
  #systemMessage;
  /**
   * @type {Array<{role: "assistant" | "system" | "user"; content: "string"}>} The messages to be sent to the AI
   */
  #messages;
  /**
   * @type {boolean} Indicates whether the chatbot is currently loading the AI's response
   */
  isLoading;
  /**
   * @type {null | "user" | "assistant"} The current mode of the chatbot. By default, it is 'user'.
   */
  mode;

  /**
   * @param {string} lang The language of the chatbot
   * @param {string} voice The voice URL of the audio speech
   * @param {string} [model] The model name as specified by ollama
   */
  constructor(lang, voice, model = "mistral:latest") {
    this.lang = lang;
    this.voice = voice;
    this.model = model;

    this.speechEnded = false;
    this.speechRecognitionEnded = false;
    this.isLoading = false;

    this.#systemMessage = OLLAMA_SYSTEM_MESSAGE_ENGLISH;
    this.#messages = [{ role: "system", content: this.#systemMessage }];

    this.mode = null;

    // @ts-expect-error Property 'SpeechRec' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
    this.speechRecognition = new p5.SpeechRec(this.lang);

    // @ts-expect-error Property 'Speech' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
    this.speech = new p5.Speech();
    this.speech.interrupt = true;
    this.speech.setLang(this.lang);
    this.speech.setVoice(this.voice);

    // Manually stop all utterances if the speech synthesis is still running
    this.speech.stop();

    // Set various events for the speech recognition and speech synthesis
    this.#setEvents();

    // Start the speech recognition
    this.startSpeechRecognition();
  }

  onSpeechRecognitionStart() {
    this.speechRecognition.onStart = () => {
      info("Chatbot: Speech recognition started", [42, 207, 92]);
      if (this.speechRecognitionEnded) this.speechRecognitionEnded = false;

      // Input mode is (back to) user since the user is speaking (again)
      this.mode = "user";
    };
  }

  onSpeechRecognitionResult() {
    this.speechRecognition.onResult = () => {
      const content = this.speechRecognition.resultString;

      // Input mode is assistant since the assistant is speaking
      this.mode = "assistant";

      if (!content) {
        return;
      }

      // Log the recognized prompt
      info("Chatbot: Speech detected");
      console.log(content);

      // Consult the AI by providing the user's recognized prompt
      this.#talk(content);
    };
  }

  onSpeechRecognitionEnd() {
    this.speechRecognition.onEnd = () => {
      info("Chatbot: Speech recognition ended", [235, 66, 66]);
      this.speechRecognitionEnded = true;
    };
  }

  onSpeechStart() {
    this.speech.onStart = () => {
      info("Chatbot: Speech started", [42, 207, 92]);
      if (this.speechEnded) this.speechEnded = false;
    };
  }

  onSpeechEnd() {
    this.speech.onEnd = () => {
      info("Chatbot: Speech ended", [235, 66, 66]);
      this.speechEnded = true;

      // Make an animation to the full size
      currentSize = 50;

      // Manually start the speech recognition again
      this.speechRecognition.start();
    };
  }

  #setEvents() {
    // this.speechRecognition
    this.onSpeechRecognitionStart();
    this.onSpeechRecognitionResult();
    this.onSpeechRecognitionEnd();

    // this.speech
    this.onSpeechStart();
    this.onSpeechEnd();
  }

  startSpeechRecognition() {
    this.speechRecognition.start();
  }

  /**
   * Sets the system message. It alters the first message in the messages array
   * if it is a system message.
   *
   * @param {string} message The system message to be sent to the AI
   */
  setSystemMessage(message) {
    this.#systemMessage = message;

    // Optionally, update the first message in the messages array if it is a system message
    if (this.#messages[0].role === "system") {
      this.#messages[0].content = this.#systemMessage;
    }
  }

  /**
   * This function consults the AI with the user's prompt and returns the AI's response.
   * It uses the messages array to both to provide context and keep track of the conversation
   *
   * @returns {Promise<{role: string; content: string}>} The AI's response to the user's prompt
   */
  async #ask() {
    let url = "http://localhost:11434/api/chat";
    let payload = {
      model: this.model,
      messages: this.#messages,
      stream: false,
    };

    try {
      const { message } = await post(url, payload);
      return message;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * This function takes the detected speech and sends it to the AI for processing.
   * First, it appends the user's prompt to the messages array. Then, it consults
   * the AI with the current messages array. Next, it uses the speech synthesizer
   * to speak the AI's response. Lastly, it appends the AI's response to the messages
   * array for the next iteration.
   *
   * @param {string} content The user's prompt to be sent to the AI
   */
  async #talk(content) {
    // First of all, append the user's prompt to the messages array
    this.#messages.push({ role: "user", content });

    // Secondly, consult the AI with the current messages array
    this.isLoading = true;
    const message = await this.#ask();
    this.isLoading = false;

    // Last but not least, use the speech synthesizer to speak the AI's response
    this.speech.speak(message.content);
    console.log(message.content);

    // At the end, append the AI's response to the messages array for the next iteration
    this.#messages.push(message);
  }
}
