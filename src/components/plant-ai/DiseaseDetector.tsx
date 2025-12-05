import { useState } from "react";
import { Bug, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "./ImageUploader";
import { ResultDisplay } from "./ResultDisplay";
import { useDiseaseDetection } from "@/hooks/use-plant-ai";

export const DiseaseDetector = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const { analyze, isLoading } = useDiseaseDetection();

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    const analysisResult = await analyze(selectedImage);
    setResult(analysisResult);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-destructive" />
          Disease Detection
        </CardTitle>
        <CardDescription>
          Upload a photo to detect plant diseases, pests, or health issues
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
          variant="destructive"
          size="lg"
        >
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? "Analyzing..." : "Detect Issues"}
        </Button>

        <ResultDisplay
          result={result}
          isLoading={isLoading}
          placeholder="Upload an image of your plant to check for diseases or health issues"
        />
      </CardContent>
    </Card>
  );
};
