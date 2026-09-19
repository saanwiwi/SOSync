export const disasterScenario = {
	active: false,

	hazards: [
		{
			type: "Flooded Arterial Road",
			location: "Bagmati River Corridor",
			severity: "CRITICAL"
		},
		{
			type: "Masonry Rubble Blockage",
			location: "Thamel Heritage Plaza",
			severity: "HIGH"
		},
		{
			type: "Collapsed Overpass Bridge",
			location: "Kalanki Intersect",
			severity: "CRITICAL"
		}
	],

	emergencies: [
		{
			id: "SOS-001",
			location: "Bagmati Riverbank",
			severity: 10,
			injury: "Submerged Vehicle Entrapment"
		},
		{
			id: "SOS-002",
			location: "Patan West Gate",
			severity: 8,
			injury: "Compound Fracture"
		},
		{
			id: "SOS-003",
			location: "Tribhuvan Logistics North",
			severity: 6,
			injury: "Smoke Inhalation"
		}
	],

	resources: [
		{
			name: "Medical Emergency Trauma Kit",
			units: 140
		},
		{
			name: "Clean Potable Water Tanker",
			units: 25
		},
		{
			name: "Tactical 4x4 Ambulance",
			units: 8
		}
	]
};

export function triggerDisaster() {
	disasterScenario.active = true;

	console.log("\n================================");
	console.log("🚨 SOSYNC DISASTER MODE ACTIVATED 🚨");
	console.log("================================");

	console.log("\n🌊 ACTIVE HAZARDS:");
	disasterScenario.hazards.forEach(hazard => {
		console.log(
			`${hazard.type} | ${hazard.location} | ${hazard.severity}`
		);
	});

	console.log("\n🆘 EMERGENCY SIGNALS IN QUEUE:");
	disasterScenario.emergencies
		.sort((a, b) => b.severity - a.severity)
		.forEach((emergency, index) => {
			console.log(
				`${index + 1}. ${emergency.id} | ${emergency.location} | Severity: ${emergency.severity}`
			);
		});

	console.log("\n📦 DEPLOYABLE SUPPLIES:");
	disasterScenario.resources.forEach(resource => {
		console.log(
			`${resource.name} | ${resource.units} units`
		);
	});

	console.log("\n⚡ SOSync is now operating in active emergency dispatch mode.");
	return disasterScenario;
}

export default {
    triggerDisaster,
    disasterScenario
};