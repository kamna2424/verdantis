import { useState } from "react";
import { Leaf, Bug, MessageCircle, Flower2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlantIdentifier } from "@/components/plant-ai/PlantIdentifier";
import { DiseaseDetector } from "@/components/plant-ai/DiseaseDetector";
import { PlantChatbot } from "@/components/plant-ai/PlantChatbot";
import { CareRecommendations } from "@/components/plant-ai/CareRecommendations";

const PlantAI = () => {
  const [activeTab, setActiveTab] = useState("identify");

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Plant AI Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Powered by advanced ML & DL for plant identification, disease detection, and care
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="identify" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span className="hidden sm:inline">Identify</span>
            </TabsTrigger>
            <TabsTrigger value="disease" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              <span className="hidden sm:inline">Disease</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="care" className="flex items-center gap-2">
              <Flower2 className="h-4 w-4" />
              <span className="hidden sm:inline">Care</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identify">
            <PlantIdentifier />
          </TabsContent>

          <TabsContent value="disease">
            <DiseaseDetector />
          </TabsContent>

          <TabsContent value="chat">
            <PlantChatbot />
          </TabsContent>

          <TabsContent value="care">
            <CareRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlantAI;
