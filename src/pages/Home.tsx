import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Droplet, TrendingUp, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Home = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={isAuthenticated} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background z-0" />
        <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              Welcome to <span className="text-primary">Verdantis</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Your intelligent plant management companion
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by Machine Learning & Deep Learning for plant identification,
              disease detection, personalized care recommendations, and AI-driven insights.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link to={isAuthenticated ? "/suggestions" : "/auth"}>
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-light hover:shadow-lg transition-all">
                  {isAuthenticated ? "Explore Suggestions" : "Get Started"}
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose Verdantis?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <Leaf className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">ML Suggestions</h3>
              <p className="text-muted-foreground">
                Get personalized plant recommendations based on ML analysis of your environment
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <Droplet className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Health Predictions</h3>
              <p className="text-muted-foreground">
                Deep learning models predict plant health and care needs
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Disease Detection</h3>
              <p className="text-muted-foreground">
                AI-powered image analysis to detect plant diseases instantly
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-border">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">AI Assistant</h3>
              <p className="text-muted-foreground">
                24/7 AI chat support for all your plant care questions
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Authenticated Features */}
      {isAuthenticated && (
        <section className="py-20 px-4 bg-secondary/30">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
              Your Plant Journey
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link to="/suggestions">
                <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-primary/20 hover:border-primary/40">
                  <h3 className="text-2xl font-bold mb-4 text-primary">
                    🌱 Get Plant Suggestions
                  </h3>
                  <p className="text-muted-foreground">
                    ML-powered recommendations based on your environment conditions
                  </p>
                </Card>
              </Link>

              <Link to="/dashboard">
                <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-accent/20 hover:border-accent/40">
                  <h3 className="text-2xl font-bold mb-4 text-accent">
                    💚 Plant Health Dashboard
                  </h3>
                  <p className="text-muted-foreground">
                    Deep learning predictions and health monitoring for your plants
                  </p>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground space-y-2">
          <p className="font-medium">Made with ❤️ - Team Verdantis</p>
          <p className="text-sm">Under the guidance of Prof. Abhuday Tripathi</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
