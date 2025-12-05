import { useState } from "react";
import { Flower2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResultDisplay } from "./ResultDisplay";
import { useCareRecommendations } from "@/hooks/use-plant-ai";

const popularPlants = [
  "Monstera Deliciosa",
  "Pothos",
  "Snake Plant",
  "Peace Lily",
  "Fiddle Leaf Fig",
  "Spider Plant",
  "Rubber Plant",
  "Philodendron",
];

export const CareRecommendations = () => {
  const [plantName, setPlantName] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { getRecommendations, isLoading } = useCareRecommendations();

  const handleGetRecommendations = async (name?: string) => {
    const searchName = name || plantName;
    if (!searchName.trim()) return;
    setPlantName(searchName);
    const recommendations = await getRecommendations(searchName);
    setResult(recommendations);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flower2 className="h-5 w-5 text-primary" />
          Care Recommendations
        </CardTitle>
        <CardDescription>
          Get detailed care instructions for any plant species
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter plant name (e.g., Monstera Deliciosa)"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGetRecommendations()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleGetRecommendations()}
            disabled={!plantName.trim() || isLoading}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Get Care Guide
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Popular:</span>
          {popularPlants.map((plant) => (
            <Button
              key={plant}
              variant="outline"
              size="sm"
              onClick={() => handleGetRecommendations(plant)}
              disabled={isLoading}
              className="text-xs"
            >
              {plant}
            </Button>
          ))}
        </div>

        <ResultDisplay
          result={result}
          isLoading={isLoading}
          placeholder="Enter a plant name or select from popular plants to get care recommendations"
        />
      </CardContent>
    </Card>
  );
};
