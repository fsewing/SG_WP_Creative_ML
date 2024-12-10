/**
 * @typedef {Object} ChatResponse
 * @property {string} model - The model name used for the response.
 * @property {string} created_at - The timestamp when the response was created.
 * @property {Object} message - The message details.
 * @property {string} message.role - The role of the message sender.
 * @property {string} message.content - The content of the message.
 * @property {string} done_reason - The reason why the operation completed.
 * @property {boolean} done - Indicates if the operation is done.
 * @property {number} total_duration - Total duration of the operation in nanoseconds.
 * @property {number} load_duration - Duration of the load phase in nanoseconds.
 * @property {number} prompt_eval_count - Number of evaluations during prompt processing.
 * @property {number} prompt_eval_duration - Duration of prompt evaluations in nanoseconds.
 * @property {number} eval_count - Total number of evaluations.
 * @property {number} eval_duration - Duration of all evaluations in nanoseconds.
 */

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
  speechRecorder;
  /**
   * @type {p5.Speech} The speech synthesizer object.
   * @link https://github.com/IDMNYU/p5.js-speech?tab=readme-ov-file#p5speech-1
   */
  speech;
  /**
   * @type {boolean} Indicates whether the chatbit is currently listening to the user's speech
   * @readonly
   */
  isRecording;
  /**
   * @type {boolean} Indicates whether the chatbot is currently speaking the AI's response
   * @readonly
   */
  isSpeaking;
  /**
   * @type {boolean} Indicates whether the chatbot is currently processing the request
   */
  isProcessing;
  /**
   * @type {string} The system message to be sent to the AI
   */
  systemMessage;
  /**
   * @type {Array<{role: "assistant" | "system" | "user"; content: "string"}>} The messages to be sent to the AI
   */
  messages;
  /**
   * @type {null | "user" | "assistant"} The current mode of the chatbot. By default, it is 'user'.
   */
  mode;
  /**
   * @type {string} The API url to consult the AI
   */
  url;
  /**
   * @type {string} The user's recorded prompt
   */
  recording;
  /**
   * @type {null | number} The confidence of the user's recorded prompt
   */
  recordingConfidence;
  /**
   * @type {null | SpeechRecognitionEvent} The user's recorded prompt in JSON format
   */
  recordingJSON;
  /**
   * @type {number} The AI's answer to the user's prompt
   */
  response;
  /**
   * @type {null | ChatResponse} The AI's answer to the user's prompt in JSON format
   */
  responseJSON;
  /**
   * @type {number} The size of the circle
   */
  circleSize;

  /**
   * @param {string} lang The language of the chatbot
   * @param {string} voice The voice URL of the audio speech
   * @param {string} [model] The model name as specified by ollama
   * @param {string} [url] The API url to consult the AI
   */
  constructor(
    lang,
    voice,
    model = "mistral:latest",
    url = "http://172.17.11.18:8888/chat"
  ) {
    this.lang = lang;
    this.voice = voice;
    this.model = model;

    this.mode = null;
    this.url = url;

    // speechRecognition
    this.isRecording = false;
    this.recording = "";
    this.recordingConfidence = null;
    this.recordingJSON = null;
    // API
    this.isProcessing = false;
    this.response = "";
    this.responseJSON = null;
    // speech
    this.isSpeaking = false;

    this.systemMessage = OLLAMA_SYSTEM_MESSAGE_ENGLISH;
    this.messages = [{ role: "system", content: this.systemMessage }];

    // @ts-expect-error Property 'SpeechRec' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
    this.speechRecorder = new p5.SpeechRec(this.lang);

    // @ts-expect-error Property 'Speech' does not exist on type '(sketch: object, node: string | object) => void'.ts(2339)
    this.speech = new p5.Speech();
    this.speech.interrupt = true;
    this.speech.setLang(this.lang);
    this.speech.setVoice(this.voice);

    // UI
    this.circleSize = 50;

    // Manually stop all utterances if the speech synthesis is still running
    this.speech.stop();

    // Set various events for the speech recognition and speech synthesis
    this.#setEvents();

    // Start the speech recognition
    this.startRecording();
  }

  /**
   * This function fires when the speech recognition starts
   * @param {() => void} [listener] The listener function to be executed (removes default logging behavior)
   */
  onRecordingStart(listener) {
    this.speechRecorder.onStart = () => {
      if (!this.isRecording) this.isRecording = true;
      this.mode = "user";

      if (listener) {
        // Bind the listener function to the Chatbot instance
        listener.bind(this)();
        return;
      }

      // DEFAULT LOGGING BEHAVIOR
      info("Chatbot: Speech recognition started", [42, 207, 92]);
    };
  }

  /**
   * This function fires when the speech recognition detects a result
   * @param {() => void} [listener] The listener function to be executed (removes default logging behavior)
   * @param {boolean} [autoSpeaksResult] Whether the chatbot should automatically speak the result or not
   */
  onRecordingResult(listener, autoSpeaksResult = true) {
    this.speechRecorder.onResult = () => {
      this.mode = "assistant";

      const { resultString, resultJSON, resultConfidence } =
        this.speechRecorder;
      this.recording = resultString || "";
      this.recordingConfidence = resultConfidence || null;
      this.recordingJSON = resultJSON || null;

      if (!this.recording) {
        return;
      }

      // Consult the AI by providing the user's recognized prompt
      if (autoSpeaksResult) this.#talk(this.recording);

      if (listener) {
        // Bind the listener function to the Chatbot instance
        listener.bind(this)();
        return;
      }

      // DEFAULT LOGGING BEHAVIOR
      info("Chatbot: Speech detected");
      console.log(this.recording);
    };
  }

  /**
   * This function fires when the speech recognition ends
   * @param {() => void} [listener] The listener function to be executed (removes default logging behavior)
   */
  onRecordingEnd(listener) {
    this.speechRecorder.onEnd = () => {
      this.isRecording = false;

      if (listener) {
        // Bind the listener function to the Chatbot instance
        listener.bind(this)();
        return;
      }

      // DEFAULT LOGGING BEHAVIOR
      info("Chatbot: Speech recognition ended", [235, 66, 66]);
    };
  }

  /**
   * This function fires when the speech synthesis starts
   * @param {() => void} [listener] The listener function to be executed (removes default logging behavior)
   */
  onSpeechStart(listener) {
    this.speech.onStart = () => {
      if (!this.isSpeaking) this.isSpeaking = true;

      if (listener) {
        // Bind the listener function to the Chatbot instance
        listener.bind(this)();
        return;
      }

      // DEFAULT LOGGING BEHAVIOR
      info("Chatbot: Speech started", [42, 207, 92]);
      console.log(this.response);
    };
  }

  /**
   * This function fires when the speech synthesis ends
   * @param {() => void} [listener] The listener function to be executed (removes default logging behavior)
   */
  onSpeechEnd(listener) {
    this.speech.onEnd = () => {
      this.isSpeaking = false;
      // Manually start the speech recognition again
      this.startRecording();
      // Make an animation to the full size
      this.circleSize = 50;

      if (listener) {
        // Bind the listener function to the Chatbot instance
        listener.bind(this)();
        return;
      }

      // DEFAULT LOGGING BEHAVIOR
      info("Chatbot: Speech ended", [235, 66, 66]);
    };
  }

  #setEvents() {
    // this.speechRecognition
    this.onRecordingStart();
    this.onRecordingResult();
    this.onRecordingEnd();

    // this.speech
    this.onSpeechStart();
    this.onSpeechEnd();
  }

  startRecording() {
    this.speechRecorder.start();
    this.speech.stop();
  }

  cancelSpeechUtterance() {
    this.speech.cancel();
  }

  stopSpeechUtterance() {
    this.speech.stop();
  }

  pauseSpeechUtterance() {
    this.speech.pause();
  }

  resumeSpeechUtterance() {
    this.speech.resume();
  }

  /**
   * Sets the system message. It alters the first message in the messages array
   * if it is a system message.
   *
   * @param {string} message The system message to be sent to the AI
   */
  setSystemMessage(message) {
    this.systemMessage = message;

    // Optionally, update the first message in the messages array if it is a system message
    if (this.messages[0].role === "system") {
      this.messages[0].content = this.systemMessage;
    }
  }

  /**
   * This function consults the AI with the user's prompt and returns the AI's response.
   * It uses the messages array to both to provide context and keep track of the conversation
   *
   * @param {{model: string; messages: {role: "assistant" | "system" | "user"; content: string; }[]}} payload The payload object to be sent to the AI
   * @returns {Promise<ChatResponse>} The AI's response to the user's prompt
   */
  async chat(payload) {
    try {
      return await post(this.url, payload);
    } catch (error) {
      console.error("Error:", error);
      return Promise.reject(error);
    }
  }

  /**
   * This function consults the AI with the user's prompt and returns the AI's response.
   * It uses the messages array to both to provide context and keep track of the conversation
   *
   * @param {{model: string; messages: {role: "assistant" | "system" | "user"; content: string; }[]}} payload The payload object to be sent to the AI
   * @param {(response: ChatResponse) => void} callback The callback function to be executed after the AI's response is received
   */
  chatCallback(payload, callback) {
    this.chat(payload)
      .then(callback)
      .catch((error) => console.error("Error:", error));
  }

  /**
   * This function uses the speech synthesizer to speak the message
   * @param {string} message The message to be spoken by the speech synthesizer
   */
  speak(message) {
    this.speech.speak(message);
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
    this.messages.push({ role: "user", content });

    // Secondly, consult the AI with the current messages array
    this.isProcessing = true;
    const data = await this.chat({
      model: this.model,
      messages: this.messages,
    });
    const { message } = data;
    this.response = message.content;
    this.responseJSON = data;
    this.isProcessing = false;

    // Last but not least, append the AI's response to the messages array for the next iteration
    this.messages.push(message);

    // And at the end, use the speech synthesizer to speak the AI's response
    this.speak(this.response);
  }
}
