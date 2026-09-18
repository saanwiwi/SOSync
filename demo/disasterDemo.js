const disasterScenario = {
	active: false,

	hazards: [
		{
			type: "Flooded Road",
			location: "Main Street",
			severity: "HIGH"
		},
		{
			type: "Blocked Road",
			location: "Central Avenue",
			severity: "MEDIUM"
		}
	],

	emergencies: [
		{
			id: "SOS-001",
			location: "Main Street",
			severity: 10
		},
		{
			id: "SOS-002",
			location: "Central Avenue",
			severity: 6
		},
		{
			id: "SOS-003",
			location: "North Road",
			severity: 8
		}
	],

	resources: [
		{
			name: "Medical Kit",
			units: 10
		},
		{
			name: "Water Supply",
			units: 25
		},
		{
			name: "Ambulance",
			units: 3
		}
	]
};

function triggerDisaster() {
	disasterScenario.active = true;

	console.log("\n================================");
	console.log("🚨 DISASTER MODE ACTIVATED 🚨");
	console.log("================================");

	console.log("\n🌊 ACTIVE HAZARDS:");

	disasterScenario.hazards.forEach(hazard => {
		console.log(
			`${hazard.type} | ${hazard.location} | ${hazard.severity}`
		);
	});

	console.log("\n🆘 EMERGENCY SIGNALS:");

	disasterScenario.emergencies
		.sort((a, b) => b.severity - a.severity)
		.forEach((emergency, index) => {
			console.log(
				`${index + 1}. ${emergency.id} | Severity: ${emergency.severity}`
			);
		});

	console.log("\n📦 AVAILABLE RESOURCES:");

	disasterScenario.resources.forEach(resource => {
		console.log(
			`${resource.name} | ${resource.units} units`
		);
	});

	console.log("\n⚡ SOSync is now operating in emergency mode.");
}

triggerDisaster();
module.exports = {
    triggerDisaster,
    disasterScenario
};