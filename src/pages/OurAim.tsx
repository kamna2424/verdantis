import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Target, Rocket, Users, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const OurAim = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={!!session} />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-foreground">
            Our Vision & Future
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            Building a greener future through technology, one plant at a time.
          </p>

          <div className="space-y-8 mb-16">
            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Target className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Verdantis aims to democratize plant care by making advanced monitoring
                    technology accessible to everyone. We believe that with the right tools
                    and guidance, anyone can develop a green thumb and contribute to a more
                    sustainable future. Our mission is to reduce plant mortality rates through
                    intelligent monitoring and predictive care recommendations.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Rocket className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Future Development</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phase 1: Enhanced IoT Integration</h3>
                      <p>Expand sensor capabilities to include light levels, air quality, and soil pH. 
                      Implement automated watering systems triggered by real-time data.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phase 2: Advanced ML Models</h3>
                      <p>Develop predictive models for plant disease detection using computer vision.
                      Create personalized care schedules based on historical data and seasonal patterns.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phase 3: Community Features</h3>
                      <p>Build a social platform where users can share plant care experiences,
                      trade cuttings, and collaborate on urban gardening projects.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Users className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Community Impact</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We envision Verdantis as more than just a plant monitoring tool. Our goal
                    is to build a thriving community of plant enthusiasts, from beginners to
                    experts. Through educational content, collaborative features, and shared
                    success stories, we aim to inspire a global movement towards greener living
                    spaces and environmental consciousness.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Globe className="w-10 h-10 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Sustainability Goals</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By 2025, we aim to help our users cultivate over 100,000 healthy plants,
                    reducing carbon footprint and improving air quality in homes and offices
                    worldwide. Our platform will incorporate sustainability metrics, showing
                    users the environmental impact of their green spaces. We're committed to
                    using eco-friendly materials in our IoT sensors and promoting sustainable
                    gardening practices.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary to-primary-light rounded-lg p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-lg mb-6 opacity-90">
              Together, we can create a greener, healthier planet—one plant at a time.
            </p>
            <p className="text-sm opacity-75">
              Follow our development roadmap and be part of the Verdantis community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurAim;
