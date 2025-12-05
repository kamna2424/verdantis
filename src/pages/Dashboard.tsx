import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import {
  plantDatabase,
  sampleUserPlants,
  predictPlantHealth,
  UserPlant,
} from "@/data/plantDataset";
import {
  Leaf,
  Droplet,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Brain,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userPlants] = useState<UserPlant[]>(sampleUserPlants);
  const [selectedPlant, setSelectedPlant] = useState<UserPlant | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthBadge = (score: number) => {
    if (score >= 85) return { label: "Excellent", variant: "default" as const };
    if (score >= 70) return { label: "Good", variant: "secondary" as const };
    return { label: "Needs Care", variant: "destructive" as const };
  };

  const overallHealth = Math.round(
    userPlants.reduce((sum, p) => sum + p.healthScore, 0) / userPlants.length
  );

  const plantsNeedingCare = userPlants.filter((p) => p.healthScore < 70).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={!!session} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Plant Dashboard</h1>
          <p className="text-muted-foreground">
            ML-powered insights for your plant collection
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userPlants.length}</p>
                  <p className="text-sm text-muted-foreground">Total Plants</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
                    {overallHealth}%
                  </p>
                  <p className="text-sm text-muted-foreground">Average Health</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{plantsNeedingCare}</p>
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">ML</p>
                  <p className="text-sm text-muted-foreground">Predictions Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Plant List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Your Plants
                </CardTitle>
                <CardDescription>
                  Click on a plant to see ML health predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userPlants.map((plant) => {
                    const plantData = plantDatabase.find((p) => p.id === plant.plantId);
                    if (!plantData) return null;

                    const health = getHealthBadge(plant.healthScore);

                    return (
                      <div
                        key={plant.id}
                        onClick={() => setSelectedPlant(plant)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          selectedPlant?.id === plant.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{plantData.image}</span>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {plant.nickname}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {plantData.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={plant.healthScore}
                                  className="w-20 h-2"
                                />
                                <span
                                  className={`font-bold ${getHealthColor(
                                    plant.healthScore
                                  )}`}
                                >
                                  {plant.healthScore}%
                                </span>
                              </div>
                            </div>
                            <Badge variant={health.variant}>{health.label}</Badge>
                          </div>
                        </div>
                        {plant.issues.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {plant.issues.map((issue, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ML Prediction Panel */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  ML Health Prediction
                </CardTitle>
                <CardDescription>
                  Deep learning analysis of plant health
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPlant ? (
                  (() => {
                    const plantData = plantDatabase.find(
                      (p) => p.id === selectedPlant.plantId
                    );
                    if (!plantData) return null;
                    const prediction = predictPlantHealth(selectedPlant, plantData);

                    return (
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <span className="text-4xl">{plantData.image}</span>
                          <h3 className="font-bold mt-2">{selectedPlant.nickname}</h3>
                          <p className="text-sm text-muted-foreground">
                            {plantData.name}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Health Prediction:</span>
                            <Badge
                              variant={
                                prediction.prediction === "Excellent"
                                  ? "default"
                                  : prediction.prediction === "Good"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {prediction.prediction}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">ML Confidence:</span>
                            <span className="font-bold text-primary">
                              {prediction.confidence}%
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            AI Recommendations:
                          </p>
                          <ul className="space-y-2">
                            {prediction.recommendations.map((rec, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 space-y-2 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <Droplet className="h-4 w-4 text-blue-500" />
                            Last watered: {selectedPlant.lastWatered}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-green-500" />
                            Last fertilized: {selectedPlant.lastFertilized}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select a plant to see ML predictions</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4 space-y-2">
              <Link to="/suggestions">
                <Button className="w-full" variant="outline">
                  <Leaf className="h-4 w-4 mr-2" />
                  Get Plant Suggestions
                </Button>
              </Link>
              <Link to="/maintenance">
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Maintenance Schedule
                </Button>
              </Link>
              <Link to="/plant-ai">
                <Button className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Use AI Plant Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
