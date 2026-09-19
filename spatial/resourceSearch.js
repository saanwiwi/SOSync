export function analyzeDistressCall(transcript) {
  // Normalize text to lowercase to ensure we don't miss capitalized words
  const text = transcript.toLowerCase();
  
  let riskScore = 0;
  const identifiedNeeds = new Set();

  // 1. Define Risk Triggers & Weights
  const riskDictionary = {
    critical: { 
      weight: 10, 
      words: ["trapped", "roof", "drowning", "baby", "unconscious", "bleeding", "pregnant"] 
    },
    high: { 
      weight: 5, 
      words: ["water rising", "stuck", "injured", "broken leg", "can't swim", "elderly"] 
    },
    medium: { 
      weight: 2, 
      words: ["hungry", "cold", "power out", "stranded", "fever", "supplies"] 
    }
  };

  // 2. Define Needs Categories
  const needsDictionary = {
    medical: ["unconscious", "bleeding", "injured", "broken leg", "fever", "pregnant"],
    boat_rescue: ["trapped", "roof", "drowning", "water rising", "stuck", "can't swim", "stranded"],
    supplies: ["hungry", "cold", "power out", "supplies"]
  };

  // 3. The Scoring Loop: Calculate how dangerous the situation is
  for (const [level, data] of Object.entries(riskDictionary)) {
    data.words.forEach(word => {
      if (text.includes(word)) {
        riskScore += data.weight;
      }
    });
  }

  // 4. The Categorization Loop: Figure out what to send them
  for (const [category, keywords] of Object.entries(needsDictionary)) {
    keywords.forEach(word => {
      if (text.includes(word)) {
        identifiedNeeds.add(category);
      }
    });
  }

  // Fallback if they speak but don't hit specific keywords
  if (identifiedNeeds.size === 0 && text.length > 0) {
    identifiedNeeds.add("general_checkup");
    riskScore += 1; // Base score for any logged distress call
  }

  // 5. Return the structured data payload
  return {
    originalText: transcript,
    riskScore: riskScore,
    needsCategory: Array.from(identifiedNeeds),
    timestamp: new Date().toISOString()
  };
}

// ==========================================
// TEST EXAMPLE (You can run this at the bottom of the file to see it work)
// ==========================================
// const testCall = "Help, the water is rising fast and my baby is trapped on the roof!";
// console.log(analyzeDistressCall(testCall));