import { useState } from "react";
import { Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "./ImageUploader";
import { ResultDisplay } from "./ResultDisplay";
import { usePlantIdentification } from "@/hooks/use-plant-ai";

export const PlantIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const { analyze, isLoading } = usePlantIdentification();

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    const analysisResult = await analyze(selectedImage);
    setResult(analysisResult);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Plant Identification
        </CardTitle>
        <CardDescription>
          Upload a photo of any plant to identify its species, family, and characteristics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImageUploader
          onImageSelect={(img) => {
            setSelectedImage(img);
            setResult(null);
          }}
          isLoading={isLoading}
        />
        
        <Button
          onClick={handleAnalyze}
          disabled={!selectedImage || isLoading}
          className="w-full"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isLoading ? "Identifying..." : "Identify Plant"}
        </Button>

        <ResultDisplay
          result={result}
          isLoading={isLoading}
          placeholder="Upload a plant image and click 'Identify Plant' to get started"
        />
      </CardContent>
    </Card>
  );
};
