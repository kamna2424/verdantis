import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import {
  plantDatabase,
  getPlantRecommendations,
  getCurrentSeason,
  EnvironmentData,
  PlantData,
} from "@/data/plantDataset";
import {
  Leaf,
  Thermometer,
  Droplet,
  Sun,
  Sparkles,
  Brain,
  Info,
  ChevronRight,
} from "lucide-react";

const Suggestions = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [environment, setEnvironment] = useState<EnvironmentData>({
    temperature: 22,
    humidity: 50,
    lightLevel: "medium",
    season: getCurrentSeason(),
  });
  const [recommendations, setRecommendations] = useState<PlantData[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantData | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const recs = getPlantRecommendations(environment);
    setRecommendations(recs);
  }, [environment]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "hard":
        return "bg-red-500/10 text-red-500";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={!!session} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            Plant Suggestions
          </h1>
          <p className="text-muted-foreground">
            ML-powered recommendations based on your environment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Environment Settings */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Your Environment
                </CardTitle>
                <CardDescription>
                  Adjust parameters for ML-based recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Temperature */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    Temperature: {environment.temperature}°C
                  </Label>
                  <Slider
                    value={[environment.temperature]}
                    onValueChange={(v) =>
                      setEnvironment((e) => ({ ...e, temperature: v[0] }))
                    }
                    min={10}
                    max={35}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Humidity */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    Humidity: {environment.humidity}%
                  </Label>
                  <Slider
                    value={[environment.humidity]}
                    onValueChange={(v) =>
                      setEnvironment((e) => ({ ...e, humidity: v[0] }))
                    }
                    min={20}
                    max={90}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Light Level */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    Light Level
                  </Label>
                  <Select
                    value={environment.lightLevel}
                    onValueChange={(v: "low" | "medium" | "high") =>
                      setEnvironment((e) => ({ ...e, lightLevel: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (shade/indirect)</SelectItem>
                      <SelectItem value="medium">Medium (bright indirect)</SelectItem>
                      <SelectItem value="high">High (direct sunlight)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Season */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    Season
                  </Label>
                  <Select
                    value={environment.season}
                    onValueChange={(v: "spring" | "summer" | "fall" | "winter") =>
                      setEnvironment((e) => ({ ...e, season: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">🌸 Spring</SelectItem>
                      <SelectItem value="summer">☀️ Summer</SelectItem>
                      <SelectItem value="fall">🍂 Fall</SelectItem>
                      <SelectItem value="winter">❄️ Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Our ML algorithm analyzes your environment against our plant
                    database of {plantDatabase.length}+ species to find the perfect
                    matches.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Top Recommendations
                </CardTitle>
                <CardDescription>
                  Plants best suited for your environment (ML confidence scores)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.map((plant, index) => (
                    <div
                      key={plant.id}
                      onClick={() => setSelectedPlant(plant)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedPlant?.id === plant.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{plant.image}</span>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {plant.name}
                            </h3>
                            <p className="text-xs text-muted-foreground italic">
                              {plant.scientificName}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getDifficultyColor(plant.difficulty)}>
                          {plant.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {plant.category}
                        </Badge>
                        {plant.toxicity === "safe" && (
                          <Badge
                            variant="outline"
                            className="text-xs text-green-500"
                          >
                            Pet Safe
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Droplet className="h-3 w-3" />
                          {plant.waterNeeds}
                        </div>
                        <div className="flex items-center gap-1">
                          <Sun className="h-3 w-3" />
                          {plant.lightNeeds}
                        </div>
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          {plant.temperatureMin}-{plant.temperatureMax}°C
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Plant Details */}
            {selectedPlant && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    {selectedPlant.name} Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedPlant.image}</span>
                    <div>
                      <h3 className="text-xl font-bold">{selectedPlant.name}</h3>
                      <p className="text-muted-foreground italic">
                        {selectedPlant.scientificName}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getDifficultyColor(selectedPlant.difficulty)}>
                          {selectedPlant.difficulty} care
                        </Badge>
                        <Badge variant="outline">{selectedPlant.growthRate} growth</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-500">Benefits</h4>
                      <ul className="space-y-1">
                        {selectedPlant.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <ChevronRight className="h-3 w-3" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-yellow-500">
                        Common Issues
                      </h4>
                      <ul className="space-y-1">
                        {selectedPlant.commonIssues.map((issue, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <ChevronRight className="h-3 w-3" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Link to="/plant-ai">
                      <Button>
                        <Brain className="h-4 w-4 mr-2" />
                        Get AI Care Tips
                      </Button>
                    </Link>
                    <Link to="/maintenance">
                      <Button variant="outline">View Care Schedule</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
