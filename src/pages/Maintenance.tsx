import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import {
  plantDatabase,
  sampleUserPlants,
  generateMaintenanceSchedule,
  getCurrentSeason,
} from "@/data/plantDataset";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Droplet,
  Leaf,
  Sun,
  Brain,
  CalendarDays,
  CalendarRange,
} from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const Maintenance = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [weekTasks, setWeekTasks] = useState<Task[]>([]);
  const [monthTasks, setMonthTasks] = useState<Task[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Generate maintenance schedule
    const schedule = generateMaintenanceSchedule(sampleUserPlants);
    setTodayTasks(
      schedule.today.map((text, i) => ({ id: `today-${i}`, text, completed: false }))
    );
    setWeekTasks(
      schedule.thisWeek.map((text, i) => ({ id: `week-${i}`, text, completed: false }))
    );
    setMonthTasks(
      schedule.thisMonth.map((text, i) => ({ id: `month-${i}`, text, completed: false }))
    );
  }, []);

  const toggleTask = (
    taskId: string,
    setter: React.Dispatch<React.SetStateAction<Task[]>>
  ) => {
    setter((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const season = getCurrentSeason();
  const seasonEmoji = {
    spring: "🌸",
    summer: "☀️",
    fall: "🍂",
    winter: "❄️",
  };

  const seasonTips = {
    spring: [
      "Start fertilizing as plants enter active growth",
      "Repot root-bound plants",
      "Increase watering frequency gradually",
      "Watch for new pest activity",
    ],
    summer: [
      "Water more frequently in hot weather",
      "Provide shade from intense afternoon sun",
      "Maintain humidity for tropical plants",
      "Continue regular fertilizing",
    ],
    fall: [
      "Reduce watering as growth slows",
      "Stop fertilizing most plants",
      "Move outdoor plants inside before frost",
      "Clean leaves to maximize light absorption",
    ],
    winter: [
      "Water sparingly - most plants are dormant",
      "Keep away from cold drafts",
      "Increase humidity around plants",
      "Hold off on repotting until spring",
    ],
  };

  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={!!session} />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Calendar className="h-10 w-10 text-primary" />
            Maintenance Schedule
          </h1>
          <p className="text-muted-foreground">
            ML-generated care tasks for your plants
          </p>
        </div>

        {/* Season Overview */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{seasonEmoji[season]}</span>
                <div>
                  <h2 className="text-2xl font-bold capitalize">{season} Care</h2>
                  <p className="text-muted-foreground">
                    Seasonal tips for your plants
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Today's Progress</p>
                <p className="text-2xl font-bold text-primary">
                  {completedToday}/{totalToday} tasks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                Today
              </CardTitle>
              <CardDescription>Urgent tasks requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {todayTasks.length > 0 ? (
                <ul className="space-y-3">
                  {todayTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id, setTodayTasks)}
                      />
                      <span
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.text}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="text-muted-foreground">All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* This Week */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-yellow-500" />
                This Week
              </CardTitle>
              <CardDescription>Tasks to complete this week</CardDescription>
            </CardHeader>
            <CardContent>
              {weekTasks.length > 0 ? (
                <ul className="space-y-3">
                  {weekTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id, setWeekTasks)}
                      />
                      <span
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.text}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="text-muted-foreground">No tasks this week</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* This Month */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-blue-500" />
                This Month
              </CardTitle>
              <CardDescription>Upcoming monthly tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {monthTasks.length > 0 ? (
                <ul className="space-y-3">
                  {monthTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id, setMonthTasks)}
                      />
                      <span
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.text}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p className="text-muted-foreground">No tasks this month</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Seasonal Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {seasonEmoji[season]} {season.charAt(0).toUpperCase() + season.slice(1)}{" "}
              Care Tips
            </CardTitle>
            <CardDescription>
              ML-curated seasonal recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {seasonTips[season].map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    {i === 0 && <Droplet className="h-4 w-4 text-blue-500" />}
                    {i === 1 && <Sun className="h-4 w-4 text-yellow-500" />}
                    {i === 2 && <Leaf className="h-4 w-4 text-green-500" />}
                    {i === 3 && <AlertCircle className="h-4 w-4 text-orange-500" />}
                  </div>
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="outline">
              <Leaf className="h-4 w-4 mr-2" />
              View Dashboard
            </Button>
          </Link>
          <Link to="/suggestions">
            <Button variant="outline">
              <Sun className="h-4 w-4 mr-2" />
              Get Suggestions
            </Button>
          </Link>
          <Link to="/plant-ai">
            <Button>
              <Brain className="h-4 w-4 mr-2" />
              Ask AI Assistant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
