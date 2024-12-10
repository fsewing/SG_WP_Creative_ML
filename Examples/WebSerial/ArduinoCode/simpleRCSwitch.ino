String inputString = "";      // a String to hold incoming data
bool stringComplete = false;  // whether the string is complete

#include <RCSwitch.h>

RCSwitch mySwitch = RCSwitch();

void setup() {
  Serial.begin(9600);
  
  // Transmitter is connected to Arduino Pin #10  
  mySwitch.enableTransmit(10);

  inputString.reserve(200);
  // Optional set protocol (default is 1, will work for most outlets)
  // mySwitch.setProtocol(2);

  // Optional set pulse length.
  // mySwitch.setPulseLength(320);
  
  // Optional set number of transmission repetitions.
  mySwitch.setRepeatTransmit(15);
  
}

void loop() {
  if (stringComplete) {
    if(inputString == "on1\n"){
      mySwitch.send(5510485, 24); // on 1
    }
    if(inputString == "off1\n"){
      mySwitch.send(5510484, 24); //off 1
    }
    
    if(inputString == "on2\n"){
      mySwitch.send(5522773, 24); // on 2
    }
    if(inputString == "off2\n"){
      mySwitch.send(5522772, 24); //off 2
    }

    if(inputString == "on3\n"){
      mySwitch.send(5525845, 24); // on 3
    }
    if(inputString == "off3\n"){
      mySwitch.send(5525844, 24); //off 3
    }

    if(inputString == "on4\n"){
      mySwitch.send(5526613, 24); // on 4
    }
    if(inputString == "off4\n"){
      mySwitch.send(5526612, 24); //off 4
    }
    inputString = "";
    stringComplete = false;
  }
  
  delay(10);  

}


void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}
