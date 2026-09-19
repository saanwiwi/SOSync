class VoiceControl {
	constructor() {
		this.recognition = null;
		this.isListening = false;

		this.setupRecognition();
	}

	setupRecognition() {
		const SpeechRecognition =
			window.SpeechRecognition ||
			window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			console.warn("Speech Recognition is not supported in this browser.");
			return;
		}

		this.recognition = new SpeechRecognition();

		this.recognition.continuous = false;
		this.recognition.interimResults = false;
		this.recognition.lang = "en-US";

		this.recognition.onstart = () => {
			this.isListening = true;
			console.log("🎤 Voice recognition started");
		};

		this.recognition.onend = () => {
			this.isListening = false;
			console.log("🎤 Voice recognition stopped");
		};

		this.recognition.onerror = (event) => {
			console.error("Voice recognition error:", event.error);
			this.isListening = false;
		};
	}

	startListening() {
		if (!this.recognition) {
			console.warn("Speech Recognition is unavailable.");
			return;
		}

		if (!this.isListening) {
			this.recognition.start();
		}
	}

	stopListening() {
		if (this.recognition && this.isListening) {
			this.recognition.stop();
		}
	}

	listen(callback) {
		if (!this.recognition) {
			console.warn("Speech Recognition is unavailable.");
			return;
		}

		this.recognition.onresult = (event) => {
			const transcript =
				event.results[event.results.length - 1][0].transcript
					.trim()
					.toLowerCase();

			console.log("🎤 Heard:", transcript);

			const command = this.parseCommand(transcript);

			callback(command);
		};

		this.startListening();
	}

	parseCommand(text) {
		// Deploy units command
		const deployMatch = text.match(
			/deploy\s+(\d+)\s+(unit|units)/
		);

		if (deployMatch) {
			return {
				type: "DEPLOY_UNITS",
				units: Number(deployMatch[1]),
				rawText: text
			};
		}

		// Trigger disaster command
		if (
			text.includes("trigger disaster") ||
			text.includes("start disaster") ||
			text.includes("simulate disaster")
		) {
			return {
				type: "TRIGGER_DISASTER",
				rawText: text
			};
		}

		// Find hospital
		if (
			text.includes("find hospital") ||
			text.includes("nearest hospital")
		) {
			return {
				type: "FIND_HOSPITAL",
				rawText: text
			};
		}

		// Find shelter
		if (
			text.includes("find shelter") ||
			text.includes("nearest shelter")
		) {
			return {
				type: "FIND_SHELTER",
				rawText: text
			};
		}

		// Unknown command
		return {
			type: "UNKNOWN",
			rawText: text
		};
	}
}

export default VoiceControl;
