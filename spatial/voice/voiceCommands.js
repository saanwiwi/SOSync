const startButton = document.getElementById("startButton");
const status = document.getElementById("status");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    status.textContent = "Voice recognition is not supported in this browser.";
} else {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    startButton.addEventListener("click", () => {
        status.textContent = "🎤 Listening...";
        recognition.start();
    });

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript;

        console.log("Voice Command:", command);

        const lowerCommand = command.toLowerCase();

        const numberMatch = lowerCommand.match(/\d+/);
        const units = numberMatch ? parseInt(numberMatch[0]) : 1;

        let unitType = "rescue";

        if (lowerCommand.includes("medical")) {
            unitType = "medical";
        } else if (lowerCommand.includes("water")) {
            unitType = "water";
        } else if (lowerCommand.includes("ambulance")) {
            unitType = "ambulance";
        }

        if (lowerCommand.includes("deploy")) {
            status.textContent =
                `🚨 Deploying ${units} ${unitType} unit${units > 1 ? "s" : ""}`;

            console.log("Deployment:", {
                units: units,
                type: unitType
            });
        } else {
            status.textContent = "Heard: " + command;
        }
    };

    recognition.onerror = (event) => {
        status.textContent = "Error: " + event.error;
    };

    recognition.onend = () => {
        console.log("Voice recognition ended.");
    };
}