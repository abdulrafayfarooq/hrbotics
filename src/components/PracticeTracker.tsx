
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileChartLine } from "lucide-react";

interface PracticeStats {
  streak: number;
  lastPractice: string;
  totalSessions: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

const motivationalMessages = [
  "Great start! Keep going!",
  "Building habits one day at a time!",
  "You're making excellent progress!",
  "Consistency is key to success!",
  "You're on your way to interview mastery!",
  "Each practice session brings you closer to your dream job!",
  "Your dedication is impressive!",
  "Keep up the fantastic work!"
];

const PracticeTracker = () => {
  const [stats, setStats] = useState<PracticeStats>({
    streak: 0,
    lastPractice: "",
    totalSessions: 0,
    weeklyGoal: 5,
    weeklyProgress: 0
  });

  useEffect(() => {
    // Load practice data from localStorage
    const loadPracticeData = () => {
      const storedStats = localStorage.getItem("hrbotics_practice_stats");
      if (storedStats) {
        const parsedStats = JSON.parse(storedStats) as PracticeStats;
        setStats(parsedStats);
      }
    };

    loadPracticeData();
  }, []);

  useEffect(() => {
    // Detect if this is a new practice session
    const today = new Date().toISOString().split('T')[0];
    
    if (stats.lastPractice !== today) {
      // Update practice stats
      const newStats = { ...stats };
      
      if (stats.lastPractice) {
        const lastDate = new Date(stats.lastPractice);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Check if last practice was yesterday to continue streak
        if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
          newStats.streak += 1;
        } else {
          // Reset streak if it's been more than a day
          newStats.streak = 1;
        }
      } else {
        // First practice session
        newStats.streak = 1;
      }
      
      newStats.lastPractice = today;
      newStats.totalSessions += 1;
      newStats.weeklyProgress = Math.min(newStats.weeklyProgress + 1, newStats.weeklyGoal);
      
      setStats(newStats);
      localStorage.setItem("hrbotics_practice_stats", JSON.stringify(newStats));
    }
  }, [stats]);

  // Get a motivational message based on the streak
  const getMotivationalMessage = () => {
    return motivationalMessages[Math.min(stats.streak - 1, motivationalMessages.length - 1)] || motivationalMessages[0];
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Practice Tracker</CardTitle>
            <CardDescription>Track your interview preparation progress</CardDescription>
          </div>
          <FileChartLine className="h-6 w-6 text-virtualhr-purple" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-virtualhr-purple-dark">
                {stats.streak} {stats.streak === 1 ? "day" : "days"}
              </div>
              <div className="text-sm text-muted-foreground">Current streak</div>
            </div>
            
            {stats.streak > 0 && (
              <div className="text-sm font-medium text-green-600">
                {getMotivationalMessage()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Goal</span>
              <span className="font-medium">{stats.weeklyProgress} of {stats.weeklyGoal} sessions</span>
            </div>
            <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} className="h-2" />
          </div>

          <div className="pt-2 text-xs text-muted-foreground border-t">
            <div>Total practice sessions: {stats.totalSessions}</div>
            {stats.lastPractice && (
              <div>Last practice: {new Date(stats.lastPractice).toLocaleDateString()}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PracticeTracker;
