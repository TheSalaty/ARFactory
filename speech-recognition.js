var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var grammar = '#JSGF V1.0; grammar words; public <words> = ivan | start | stop | schneller | langsamer;';
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'de-DE';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
var i = 0;

//var diagnostic = document.querySelector('.output');
var factory = document.getElementById("factory-entity");

    recognition.start();
    console.log('Ready to receive a command.');

recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var voiceCommand = event.results[i][0].transcript;
    i++;
    //diagnostic.textContent = 'Result received: ' + voiceCommand + '.';
    console.log("voice command " + voiceCommand);
    if(voiceCommand.includes("Alex") || voiceCommand.includes("alex")){
     if(voiceCommand.includes("start")) {
        factory.setAttribute('animation-mixer', {timeScale: 1});
        console.log("factory starts...");
     }
        else if(voiceCommand.includes("stop")) {
        factory.setAttribute('animation-mixer', {timeScale: 0});
        console.log("factory stops...");
        }

        else if(voiceCommand.includes("schneller")) {
        factory.setAttribute('animation-mixer', {timeScale: 1.5});
        console.log("factory schneller...");
        }

        else if(voiceCommand.includes("langsamer")) {
        factory.setAttribute('animation-mixer', {timeScale: 0.5});
        console.log("factory langsamer...");
        }
        
        else {
        console.log("Alex says: unsupported voice command");
    }
    //reset transcript
    voiceCommand = "";
    }

    //factory.setAttribute('voiceCommand', voiceCommand);
    console.log('Confidence: ' + event.results[0][0].confidence);
}


// run function of recognition activation word

recognition.onnomatch = function(event) {
    //diagnostic.textContent = 'I didnt recognise that color.';
}

recognition.onerror = function(event) {
    //diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}