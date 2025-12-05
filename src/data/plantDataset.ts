// Sample plant dataset for ML-based predictions and recommendations

export interface PlantData {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  waterNeeds: "low" | "medium" | "high";
  lightNeeds: "low" | "medium" | "high";
  humidity: "low" | "medium" | "high";
  temperatureMin: number;
  temperatureMax: number;
  growthRate: "slow" | "medium" | "fast";
  toxicity: "safe" | "mild" | "toxic";
  benefits: string[];
  commonIssues: string[];
  image: string;
}

export interface UserPlant {
  id: string;
  plantId: string;
  nickname: string;
  healthScore: number;
  lastWatered: string;
  lastFertilized: string;
  issues: string[];
  addedDate: string;
}

export interface EnvironmentData {
  temperature: number;
  humidity: number;
  lightLevel: "low" | "medium" | "high";
  season: "spring" | "summer" | "fall" | "winter";
}

// Comprehensive plant dataset
export const plantDatabase: PlantData[] = [
  {
    id: "1",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    category: "Succulent",
    difficulty: "easy",
    waterNeeds: "low",
    lightNeeds: "low",
    humidity: "low",
    temperatureMin: 15,
    temperatureMax: 30,
    growthRate: "slow",
    toxicity: "mild",
    benefits: ["Air purification", "Oxygen at night", "Low maintenance"],
    commonIssues: ["Root rot from overwatering", "Brown tips from dry air"],
    image: "🐍",
  },
  {
    id: "2",
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    category: "Vine",
    difficulty: "easy",
    waterNeeds: "medium",
    lightNeeds: "low",
    humidity: "medium",
    temperatureMin: 18,
    temperatureMax: 30,
    growthRate: "fast",
    toxicity: "toxic",
    benefits: ["Air purification", "Fast growing", "Easy propagation"],
    commonIssues: ["Yellow leaves from overwatering", "Leggy growth in low light"],
    image: "🌿",
  },
  {
    id: "3",
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    category: "Tropical",
    difficulty: "medium",
    waterNeeds: "medium",
    lightNeeds: "medium",
    humidity: "high",
    temperatureMin: 18,
    temperatureMax: 30,
    growthRate: "medium",
    toxicity: "toxic",
    benefits: ["Statement plant", "Air purification", "Easy care"],
    commonIssues: ["Brown spots from direct sun", "Yellow leaves from overwatering"],
    image: "🌴",
  },
  {
    id: "4",
    name: "Peace Lily",
    scientificName: "Spathiphyllum",
    category: "Flowering",
    difficulty: "easy",
    waterNeeds: "high",
    lightNeeds: "low",
    humidity: "high",
    temperatureMin: 18,
    temperatureMax: 27,
    growthRate: "medium",
    toxicity: "toxic",
    benefits: ["Air purification", "Beautiful flowers", "Shade tolerant"],
    commonIssues: ["Drooping when thirsty", "Brown tips from chlorine"],
    image: "☮️",
  },
  {
    id: "5",
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    category: "Grass-like",
    difficulty: "easy",
    waterNeeds: "medium",
    lightNeeds: "medium",
    humidity: "medium",
    temperatureMin: 13,
    temperatureMax: 27,
    growthRate: "fast",
    toxicity: "safe",
    benefits: ["Air purification", "Pet safe", "Easy propagation"],
    commonIssues: ["Brown tips from fluoride", "Pale leaves from too much sun"],
    image: "🕷️",
  },
  {
    id: "6",
    name: "Rubber Plant",
    scientificName: "Ficus elastica",
    category: "Tree",
    difficulty: "medium",
    waterNeeds: "medium",
    lightNeeds: "medium",
    humidity: "medium",
    temperatureMin: 16,
    temperatureMax: 27,
    growthRate: "medium",
    toxicity: "mild",
    benefits: ["Air purification", "Dramatic foliage", "Long-lived"],
    commonIssues: ["Leaf drop from cold drafts", "Yellowing from overwatering"],
    image: "🌳",
  },
  {
    id: "7",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    category: "Succulent",
    difficulty: "easy",
    waterNeeds: "low",
    lightNeeds: "high",
    humidity: "low",
    temperatureMin: 13,
    temperatureMax: 30,
    growthRate: "slow",
    toxicity: "mild",
    benefits: ["Medicinal uses", "Air purification", "Low maintenance"],
    commonIssues: ["Root rot from overwatering", "Brown tips from too much sun"],
    image: "🪴",
  },
  {
    id: "8",
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    category: "Tree",
    difficulty: "hard",
    waterNeeds: "medium",
    lightNeeds: "high",
    humidity: "medium",
    temperatureMin: 18,
    temperatureMax: 27,
    growthRate: "slow",
    toxicity: "toxic",
    benefits: ["Statement plant", "Air purification", "Modern aesthetic"],
    commonIssues: ["Brown spots", "Leaf drop from changes", "Root rot"],
    image: "🎻",
  },
  {
    id: "9",
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    category: "Succulent",
    difficulty: "easy",
    waterNeeds: "low",
    lightNeeds: "low",
    humidity: "low",
    temperatureMin: 15,
    temperatureMax: 30,
    growthRate: "slow",
    toxicity: "toxic",
    benefits: ["Extremely low maintenance", "Drought tolerant", "Low light tolerant"],
    commonIssues: ["Yellow leaves from overwatering", "Slow growth"],
    image: "💚",
  },
  {
    id: "10",
    name: "Boston Fern",
    scientificName: "Nephrolepis exaltata",
    category: "Fern",
    difficulty: "medium",
    waterNeeds: "high",
    lightNeeds: "medium",
    humidity: "high",
    temperatureMin: 16,
    temperatureMax: 24,
    growthRate: "medium",
    toxicity: "safe",
    benefits: ["Air purification", "Pet safe", "Lush foliage"],
    commonIssues: ["Brown fronds from dry air", "Leaf drop from underwatering"],
    image: "🌿",
  },
  {
    id: "11",
    name: "Jade Plant",
    scientificName: "Crassula ovata",
    category: "Succulent",
    difficulty: "easy",
    waterNeeds: "low",
    lightNeeds: "high",
    humidity: "low",
    temperatureMin: 10,
    temperatureMax: 27,
    growthRate: "slow",
    toxicity: "toxic",
    benefits: ["Long-lived", "Easy propagation", "Bonsai potential"],
    commonIssues: ["Leaf drop from overwatering", "Leggy from low light"],
    image: "💎",
  },
  {
    id: "12",
    name: "Philodendron",
    scientificName: "Philodendron hederaceum",
    category: "Vine",
    difficulty: "easy",
    waterNeeds: "medium",
    lightNeeds: "medium",
    humidity: "medium",
    temperatureMin: 18,
    temperatureMax: 30,
    growthRate: "fast",
    toxicity: "toxic",
    benefits: ["Versatile", "Easy care", "Air purification"],
    commonIssues: ["Yellow leaves from overwatering", "Small leaves from low light"],
    image: "💚",
  },
];

// Sample user plants for dashboard
export const sampleUserPlants: UserPlant[] = [
  {
    id: "up1",
    plantId: "1",
    nickname: "Snakey",
    healthScore: 92,
    lastWatered: "2024-01-10",
    lastFertilized: "2024-01-01",
    issues: [],
    addedDate: "2023-06-15",
  },
  {
    id: "up2",
    plantId: "3",
    nickname: "Monty",
    healthScore: 78,
    lastWatered: "2024-01-08",
    lastFertilized: "2023-12-15",
    issues: ["Needs higher humidity", "Yellow leaf spotted"],
    addedDate: "2023-08-20",
  },
  {
    id: "up3",
    plantId: "4",
    nickname: "Lily",
    healthScore: 65,
    lastWatered: "2024-01-05",
    lastFertilized: "2023-11-20",
    issues: ["Drooping leaves", "Needs water"],
    addedDate: "2023-09-10",
  },
  {
    id: "up4",
    plantId: "7",
    nickname: "Alvin",
    healthScore: 88,
    lastWatered: "2024-01-02",
    lastFertilized: "2023-10-15",
    issues: [],
    addedDate: "2023-05-01",
  },
];

// ML-based recommendation algorithm
export const getPlantRecommendations = (env: EnvironmentData): PlantData[] => {
  return plantDatabase
    .map((plant) => {
      let score = 0;

      // Temperature match
      if (env.temperature >= plant.temperatureMin && env.temperature <= plant.temperatureMax) {
        score += 30;
      } else if (
        env.temperature >= plant.temperatureMin - 3 &&
        env.temperature <= plant.temperatureMax + 3
      ) {
        score += 15;
      }

      // Humidity match
      if (env.humidity >= 60 && plant.humidity === "high") score += 25;
      else if (env.humidity >= 40 && env.humidity < 60 && plant.humidity === "medium") score += 25;
      else if (env.humidity < 40 && plant.humidity === "low") score += 25;
      else score += 10;

      // Light match
      if (env.lightLevel === plant.lightNeeds) score += 25;
      else score += 10;

      // Season adjustment
      if (env.season === "winter" && plant.difficulty === "easy") score += 10;
      if (env.season === "spring" && plant.growthRate === "fast") score += 10;
      if (env.season === "summer" && plant.lightNeeds === "high") score += 10;

      return { ...plant, score };
    })
    .sort((a, b) => (b as any).score - (a as any).score)
    .slice(0, 6);
};

// ML-based health prediction
export const predictPlantHealth = (plant: UserPlant, plantData: PlantData): {
  prediction: string;
  confidence: number;
  recommendations: string[];
} => {
  const daysSinceWatered = Math.floor(
    (Date.now() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysSinceFertilized = Math.floor(
    (Date.now() - new Date(plant.lastFertilized).getTime()) / (1000 * 60 * 60 * 24)
  );

  const recommendations: string[] = [];
  let healthPrediction = "Good";
  let confidence = 85;

  // Watering analysis
  if (plantData.waterNeeds === "high" && daysSinceWatered > 3) {
    recommendations.push("Water immediately - this plant needs frequent watering");
    confidence -= 15;
    healthPrediction = "Needs Attention";
  } else if (plantData.waterNeeds === "medium" && daysSinceWatered > 5) {
    recommendations.push("Consider watering soon");
    confidence -= 10;
  } else if (plantData.waterNeeds === "low" && daysSinceWatered < 7) {
    recommendations.push("Be careful not to overwater");
  }

  // Fertilizer analysis
  if (daysSinceFertilized > 30) {
    recommendations.push("Consider fertilizing during the growing season");
    confidence -= 5;
  }

  // Issue analysis
  if (plant.issues.length > 0) {
    healthPrediction = "Needs Attention";
    confidence -= plant.issues.length * 10;
    plant.issues.forEach((issue) => {
      recommendations.push(`Address: ${issue}`);
    });
  }

  if (plant.healthScore < 70) {
    healthPrediction = "Critical";
    confidence = Math.max(confidence - 20, 40);
  } else if (plant.healthScore >= 85) {
    healthPrediction = "Excellent";
    confidence = Math.min(confidence + 10, 95);
  }

  return {
    prediction: healthPrediction,
    confidence: Math.max(confidence, 40),
    recommendations: recommendations.length > 0 ? recommendations : ["Keep up the great care!"],
  };
};

// Get current season
export const getCurrentSeason = (): "spring" | "summer" | "fall" | "winter" => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};

// Maintenance schedule generator
export const generateMaintenanceSchedule = (userPlants: UserPlant[]): {
  today: string[];
  thisWeek: string[];
  thisMonth: string[];
} => {
  const today: string[] = [];
  const thisWeek: string[] = [];
  const thisMonth: string[] = [];

  userPlants.forEach((plant) => {
    const plantData = plantDatabase.find((p) => p.id === plant.plantId);
    if (!plantData) return;

    const daysSinceWatered = Math.floor(
      (Date.now() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysSinceFertilized = Math.floor(
      (Date.now() - new Date(plant.lastFertilized).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Watering schedule
    if (plantData.waterNeeds === "high" && daysSinceWatered >= 2) {
      today.push(`Water ${plant.nickname} (${plantData.name})`);
    } else if (plantData.waterNeeds === "medium" && daysSinceWatered >= 4) {
      thisWeek.push(`Water ${plant.nickname} (${plantData.name})`);
    } else if (plantData.waterNeeds === "low" && daysSinceWatered >= 10) {
      thisWeek.push(`Check if ${plant.nickname} needs water`);
    }

    // Fertilizing schedule
    if (daysSinceFertilized > 30) {
      thisMonth.push(`Fertilize ${plant.nickname} (${plantData.name})`);
    }

    // Issue-based tasks
    plant.issues.forEach((issue) => {
      today.push(`Check ${plant.nickname}: ${issue}`);
    });
  });

  return { today, thisWeek, thisMonth };
};
