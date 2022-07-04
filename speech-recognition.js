var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var grammar = '#JSGF V1.0; grammar words; public <words> = alex | start | stop | schneller | langsamer | größer | kleiner';
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
     if(voiceCommand.includes("start") || voiceCommand.includes("Start")) {
        factory.setAttribute('animation-mixer', {timeScale: 1});
        console.log("factory starts...");
     }
        else if(voiceCommand.includes("stop") || voiceCommand.includes("Stop")) {
            factory.setAttribute('animation-mixer', {timeScale: 0});
            console.log("factory stops...");
        }

        else if(voiceCommand.includes("schneller") || voiceCommand.includes("Schneller")) {
            factory.setAttribute('animation-mixer', {timeScale: 1.5});
            console.log("factory schneller...");
        }

        else if(voiceCommand.includes("langsamer") || voiceCommand.includes("Langsamer")) {
            factory.setAttribute('animation-mixer', {timeScale: 0.5});
            console.log("factory langsamer...");
        }

        else if(voiceCommand.includes("größer") || voiceCommand.includes("Größer")) {
        //increase size glb object
            factory.setAttribute('scale', {x: 1.5, y: 1.5, z: 1.5});
            console.log("factory größer...");
        }

        else if(voiceCommand.includes("kleiner") || voiceCommand.includes("Kleiner")) {
        //decrease size glb object
            factory.setAttribute('scale', {x: 0.5, y: 0.5, z: 0.5});
            console.log("factory kleiner...");
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


recognition.onnomatch = function(event) {
    //diagnostic.textContent = 'I didnt recognise that.';
}

recognition.onerror = function(event) {
    //diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}