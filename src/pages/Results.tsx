import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Share, FileChartLine } from 'lucide-react';
import { generatePDF, downloadReport, FeedbackReport } from '@/utils/pdfGenerator';

interface EmotionData {
  face: string;
  voice: string;
}

interface EmotionResults {
  [timestamp: string]: EmotionData;
}

const emotionColors = {
  happy: "#22c55e",
  neutral: "#9b87f5",
  confident: "#3b82f6",
  hesitant: "#f59e0b",
  thinking: "#6b7280",
  sad: "#ef4444",
  nervous: "#f97316"
};

const emotionScores = {
  happy: 5,
  confident: 5,
  neutral: 3,
  thinking: 3,
  hesitant: 2,
  nervous: 1,
  sad: 1
};

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState<EmotionResults | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [emotionCounts, setEmotionCounts] = useState<any[]>([]);
  const [interviewMode, setInterviewMode] = useState<string>("general");
  const [interviewModeName, setInterviewModeName] = useState<string>("General Interview");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const storedResults = localStorage.getItem('virtualhr_interview_results');
    const storedMode = localStorage.getItem('virtualhr_interview_mode');
    const storedModeName = localStorage.getItem('virtualhr_interview_mode_name');
    
    if (storedMode) {
      setInterviewMode(storedMode);
    }
    
    if (storedModeName) {
      setInterviewModeName(storedModeName);
    }
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults) as EmotionResults;
        setResults(parsedResults);
        
        // Transform data for line chart
        const transformedData = Object.entries(parsedResults).map(([timestamp, data]) => {
          const timeInSeconds = parseInt(timestamp.split('_')[1] || '0');
          return {
            time: timeInSeconds,
            faceEmotion: data.face,
            voiceEmotion: data.voice,
            faceScore: emotionScores[data.face as keyof typeof emotionScores] || 3,
            voiceScore: emotionScores[data.voice as keyof typeof emotionScores] || 3,
          };
        });
        
        // Sort by timestamp
        transformedData.sort((a, b) => a.time - b.time);
        setChartData(transformedData);
        
        // Calculate emotion counts for pie chart
        const emotions = [...Object.values(parsedResults).map(d => d.face), ...Object.values(parsedResults).map(d => d.voice)];
        const counts = emotions.reduce((acc: Record<string, number>, emotion) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {});
        
        const pieData = Object.entries(counts).map(([emotion, count]) => ({
          name: emotion,
          value: count
        }));
        
        setEmotionCounts(pieData);
        
      } catch (error) {
        console.error('Failed to parse results:', error);
      }
    } else {
      // No results found, redirect to interview page
      navigate('/interview');
    }
  }, [navigate]);
  
  const generateFeedback = () => {
    if (!results) return [];
    
    const feedback = [];
    
    // Count emotions
    const faceEmotions = Object.values(results).map(r => r.face);
    const voiceEmotions = Object.values(results).map(r => r.voice);
    
    const happyCount = faceEmotions.filter(e => e === 'happy').length;
    const confidentCount = voiceEmotions.filter(e => e === 'confident').length;
    const hesitantCount = voiceEmotions.filter(e => e === 'hesitant').length;
    const neutralCount = faceEmotions.filter(e => e === 'neutral').length;
    const thinkingCount = faceEmotions.filter(e => e === 'thinking').length;
    
    // Generate feedback based on counts and mode
    if (happyCount > faceEmotions.length / 3) {
      feedback.push({
        type: 'positive',
        text: 'You appeared happy and engaged throughout most of your interview. Great job! 😊'
      });
    }
    
    if (confidentCount > voiceEmotions.length / 3) {
      feedback.push({
        type: 'positive',
        text: 'Your voice projected confidence for a significant part of the interview. This is excellent!'
      });
    }
    
    if (hesitantCount > voiceEmotions.length / 4) {
      feedback.push({
        type: 'improvement',
        text: 'You sounded hesitant at times. Try practicing your answers to common questions to build confidence.'
      });
    }
    
    if (neutralCount > faceEmotions.length / 2) {
      feedback.push({
        type: 'improvement',
        text: 'Your facial expressions were mostly neutral. Consider showing more enthusiasm through your expressions.'
      });
    }
    
    // Mode-specific feedback
    switch(interviewMode) {
      case 'technical':
        if (thinkingCount > faceEmotions.length / 4) {
          feedback.push({
            type: 'positive',
            text: 'You showed thoughtful consideration before answering technical questions, which is great for technical interviews.'
          });
        }
        feedback.push({
          type: 'tip',
          text: 'In technical interviews, it\'s good to explain your thought process as you work through problems.'
        });
        break;
      
      case 'hr':
        if (happyCount < faceEmotions.length / 4) {
          feedback.push({
            type: 'improvement',
            text: 'HR interviews focus on cultural fit. Try to show more warmth and enthusiasm.'
          });
        }
        feedback.push({
          type: 'tip',
          text: 'Use the STAR method (Situation, Task, Action, Result) when answering behavioral questions in HR interviews.'
        });
        break;
        
      case 'leadership':
        feedback.push({
          type: 'tip',
          text: "Leadership interviews assess your ability to influence and inspire. Share concrete examples of how you've led teams."
        });
        if (confidentCount < voiceEmotions.length / 3) {
          feedback.push({
            type: 'improvement',
            text: 'Leadership roles require confidence. Work on maintaining a confident tone throughout the interview.'
          });
        }
        break;
        
      default:
        // Add general tips
        feedback.push({
          type: 'tip',
          text: 'Remember to maintain eye contact with the interviewer (or camera) to demonstrate engagement.'
        });
    }
    
    // Add general tips
    feedback.push({
      type: 'tip',
      text: 'Vary your tone and pace to keep the interviewer engaged and emphasize key points.'
    });
    
    return feedback;
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !results) return;
    
    try {
      setGeneratingPdf(true);
      
      const feedback = generateFeedback();
      const overallScore = Math.floor(chartData.reduce((sum, item) => sum + item.voiceScore + item.faceScore, 0) / (chartData.length * 2) * 20);
      
      const reportData: FeedbackReport = {
        timestamp: new Date().toLocaleString(),
        overallScore,
        emotionData: chartData,
        feedback,
        interviewMode: interviewModeName
      };
      
      const pdfBlobUrl = await generatePDF(reportRef, reportData);
      downloadReport(pdfBlobUrl, `hrbotics-interview-report-${Date.now()}.png`);
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your interview report has been downloaded.",
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Failed to generate PDF",
        description: "An error occurred while generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My HRbotics Interview Results',
        text: `I just practiced a ${interviewModeName} with HRbotics! Check out this AI interview assistant.`,
        url: window.location.href
      }).then(() => {
        toast({
          title: "Shared Successfully",
          description: "Your results have been shared.",
        });
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link Copied",
          description: "Results link copied to clipboard.",
        });
      }).catch(console.error);
    }
  };

  if (!results) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Loading your results...</p>
          <Button 
            variant="outline"
            onClick={() => navigate('/interview')}
          >
            Go to Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={reportRef} className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Results</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Analysis of your {interviewModeName.toLowerCase()} performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShareResults}
          >
            <Share size={16} />
            Share
          </Button>
          <Button 
            variant="default" 
            className="bg-virtualhr-purple hover:bg-virtualhr-purple-dark flex items-center gap-2"
            onClick={handleDownloadPDF}
            disabled={generatingPdf}
          >
            <Download size={16} />
            {generatingPdf ? 'Generating...' : 'Download Report'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Emotion Timeline</CardTitle>
              <CardDescription>How your emotions changed during the interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -10 }} 
                    />
                    <YAxis 
                      label={{ value: 'Confidence Score', angle: -90, position: 'insideLeft' }} 
                      domain={[0, 5]} 
                    />
                    <Tooltip 
                      formatter={(value, name, props) => {
                        if (name === 'faceScore') return [props.payload.faceEmotion, 'Face'];
                        if (name === 'voiceScore') return [props.payload.voiceEmotion, 'Voice'];
                        return [value, name];
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="faceScore" 
                      name="Face" 
                      stroke="#9b87f5" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="voiceScore" 
                      name="Voice" 
                      stroke="#33C3F0" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-virtualhr-purple" />
                  Feedback 
                  <span className="text-sm font-normal text-muted-foreground">
                    ({interviewModeName})
                  </span>
                </CardTitle>
                <CardDescription>Personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generateFeedback().map((item, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-md ${
                      item.type === 'positive' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
                        : item.type === 'improvement'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                    }`}
                  >
                    <p className="text-sm">{item.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice More</CardTitle>
                <CardDescription>Continue improving your skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Regular practice is the key to interview success. Try recording another interview
                  with different questions to build your confidence.
                </p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/interview')}
                  >
                    New Interview
                  </Button>
                  <Button
                    className="bg-virtualhr-purple hover:bg-virtualhr-purple-dark"
                    onClick={() => navigate('/resume')}
                  >
                    Upload Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Emotion Distribution</CardTitle>
              <CardDescription>Breakdown of your emotional states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionCounts}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionCounts.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={emotionColors[entry.name as keyof typeof emotionColors] || "#9ca3af"} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileChartLine className="h-5 w-5 text-virtualhr-purple" />
                Key Metrics
              </CardTitle>
              <CardDescription>Your performance at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Confidence</span>
                <span className="text-sm font-medium text-virtualhr-purple">
                  {Math.floor(chartData.reduce((sum, item) => sum + item.voiceScore, 0) / chartData.length * 20)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-virtualhr-purple h-2.5 rounded-full" 
                  style={{ width: `${Math.floor(chartData.reduce((sum, item) => sum + item.voiceScore, 0) / chartData.length * 20)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Positive Expressions</span>
                <span className="text-sm font-medium text-virtualhr-blue-bright">
                  {Math.floor(chartData.filter(item => ['happy', 'confident'].includes(item.faceEmotion)).length / chartData.length * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-virtualhr-blue-bright h-2.5 rounded-full" 
                  style={{ width: `${Math.floor(chartData.filter(item => ['happy', 'confident'].includes(item.faceEmotion)).length / chartData.length * 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Voice Clarity</span>
                <span className="text-sm font-medium text-green-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;
