import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Sprout, Brain } from "lucide-react";
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
            A comprehensive plant management system powered by Machine Learning 
            and Deep Learning to help you nurture your green companions.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <Sprout className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">What We Do</h2>
              <p className="text-muted-foreground leading-relaxed">
                Verdantis revolutionizes plant care through Machine Learning and Deep Learning.
                Our platform uses AI-powered algorithms to identify plants, detect diseases,
                provide personalized care recommendations, and help you maintain optimal
                conditions for your green friends.
              </p>
            </Card>

            <Card className="p-8 border-border hover:shadow-lg transition-shadow">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">AI-Powered Intelligence</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our machine learning models analyze plant images to identify species and
                detect diseases instantly. The AI assistant answers all your plant care
                questions, from "Why are my leaves turning yellow?" to "How much sunlight
                does this plant need?" - all powered by advanced deep learning algorithms.
              </p>
            </Card>
          </div>

          <div className="bg-secondary/30 rounded-lg p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Team Verdantis</h2>
            <p className="text-lg text-muted-foreground">
              Verdantis is built by a team focused on making practical, AI-powered plant care
              accessible to everyone.
            </p>
          </div>

          <div className="bg-secondary/30 rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Technology Stack</h2>
            <div className="grid md:grid-cols-3 gap-6 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Frontend</h3>
                <p>React, TypeScript, Tailwind CSS</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Backend</h3>
                <p>Lovable Cloud, Edge Functions</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">AI & ML</h3>
                <p>Deep Learning, ML Models, AI Assistants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground space-y-2">
          <p className="font-medium">Made with ❤️ - Team Verdantis</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
