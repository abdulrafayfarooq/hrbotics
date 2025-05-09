
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/components/ui/use-toast";
import { Video, Upload, Camera, PauseCircle } from 'lucide-react';

// Mock function to simulate analysis
const analyzeInterview = () => {
  // In a real application, this would call an API or use ML libraries
  // We'll return mock data for now
  return new Promise<Record<string, { face: string, voice: string }>>(resolve => {
    setTimeout(() => {
      resolve({
        "timestamp_0": { "face": "happy", "voice": "neutral" },
        "timestamp_10": { "face": "neutral", "voice": "confident" },
        "timestamp_20": { "face": "thinking", "voice": "hesitant" },
        "timestamp_30": { "face": "happy", "voice": "confident" },
        "timestamp_40": { "face": "neutral", "voice": "neutral" },
      });
    }, 3000);
  });
};

const Interview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Show live video feed
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Set up recording
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);
        
        // Stop all tracks of the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Remove the stream from video element
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly and maintain eye contact with the camera.",
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow access to your camera and microphone to use this feature.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your interview has been recorded successfully.",
      });
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setRecordedVideo(videoURL);
      toast({
        title: "Video uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };
  
  const analyzeVideo = async () => {
    if (!recordedVideo) return;
    
    setAnalyzing(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // This would be an API call in a real app
      const results = await analyzeInterview();
      
      // Save results to localStorage for the Results page
      localStorage.setItem('virtualhr_interview_results', JSON.stringify(results));
      
      // Complete progress and navigate
      clearInterval(progressInterval);
      setProgress(100);
      
      // Brief delay before navigating
      setTimeout(() => {
        navigate('/results');
      }, 500);
      
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      setAnalyzing(false);
      setProgress(0);
      
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your interview. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const resetInterview = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
    setRecordedVideo(null);
    setIsRecording(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interview Practice</h1>
        <p className="text-gray-600 mt-2">Record your practice interview or upload an existing video</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-black relative">
              {isRecording || recordedVideo ? (
                <video 
                  ref={videoRef} 
                  src={recordedVideo || undefined} 
                  className="w-full h-full object-cover"
                  controls={!!recordedVideo}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
                  <Camera size={64} className="mb-4 text-virtualhr-purple" />
                  <p className="text-lg">Ready to record your interview</p>
                  <p className="text-sm text-gray-400 mt-2">Click "Start Recording" or upload a video</p>
                </div>
              )}
              
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
                  <span className="animate-ping absolute h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative">Recording</span>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 flex justify-between">
              {!isRecording && !recordedVideo ? (
                <>
                  <Button 
                    variant="default"
                    className="bg-virtualhr-purple hover:bg-virtualhr-purple-dark"
                    onClick={startRecording}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                  
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button variant="outline" type="button">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </Button>
                  </label>
                </>
              ) : isRecording ? (
                <Button 
                  variant="destructive"
                  onClick={stopRecording}
                >
                  <PauseCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={resetInterview}
                  >
                    Record Again
                  </Button>
                  
                  <Button 
                    variant="default"
                    className="bg-virtualhr-purple hover:bg-virtualhr-purple-dark"
                    onClick={analyzeVideo}
                    disabled={analyzing}
                  >
                    {analyzing ? "Analyzing..." : "Analyze Interview"}
                  </Button>
                </>
              )}
            </div>
          </Card>
          
          {analyzing && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Analyzing your interview...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Interview Tips</CardTitle>
              <CardDescription>
                How to perform your best during the interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-virtualhr-purple-soft rounded-md">
                <h3 className="font-medium text-virtualhr-purple-dark">Body Language</h3>
                <p className="text-sm text-gray-700 mt-1">Maintain good posture and keep steady eye contact with the camera.</p>
              </div>
              
              <div className="p-3 bg-virtualhr-blue-soft rounded-md">
                <h3 className="font-medium text-virtualhr-blue-bright">Voice & Tone</h3>
                <p className="text-sm text-gray-700 mt-1">Speak clearly, vary your tone, and pause occasionally to show thoughtfulness.</p>
              </div>
              
              <div className="p-3 bg-gray-100 rounded-md">
                <h3 className="font-medium">Common Questions</h3>
                <ul className="text-sm text-gray-700 mt-1 space-y-1 list-disc list-inside">
                  <li>Tell me about yourself</li>
                  <li>Why do you want this position?</li>
                  <li>What are your strengths and weaknesses?</li>
                  <li>Where do you see yourself in 5 years?</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Interview;
