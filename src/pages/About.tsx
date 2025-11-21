import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Sprout, Activity, Brain, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const About = () => {
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
            About Verdantis
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            A comprehensive plant management system that combines IoT sensors, 
            machine learning, and beautiful design to help you nurture your green companions.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <Sprout className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">What We Do</h2>
              <p className="text-muted-foreground leading-relaxed">
                Verdantis revolutionizes plant care by providing real-time monitoring through
                IoT sensors (ESP-32 with moisture, temperature, and humidity sensors). Our
                platform analyzes environmental data to suggest the perfect plants for your
                space and helps maintain optimal conditions for your existing green friends.
              </p>
            </Card>

            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <Activity className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">Real-time Monitoring</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our dashboard provides live updates on your plants' health status. Track
                soil moisture, temperature, and humidity levels with precision. Receive
                instant alerts when your plants need water or environmental conditions
                require adjustment. Weekly PDF health reports keep you informed of trends.
              </p>
            </Card>

            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">AI-Powered Intelligence</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our machine learning models analyze environmental data to suggest plants
                perfectly suited to your conditions. The AI chat support answers all your
                plant care questions, from "Why are my leaves turning yellow?" to
                "How much sunlight does this plant need?"
              </p>
            </Card>

            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <Mail className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">Stay Connected</h2>
              <p className="text-muted-foreground leading-relaxed">
                Receive email notifications when your plants need attention. Get weekly
                health reports delivered to your inbox. Our notification system ensures
                you never miss a critical moment in your plants' care routine, even when
                you're away from the dashboard.
              </p>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Technology Stack</h2>
            <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Frontend</h3>
                <p>React, TypeScript, Tailwind CSS</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Backend</h3>
                <p>Lovable Cloud (Supabase), Edge Functions</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">IoT & ML</h3>
                <p>ESP-32, Python, ML Models</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
