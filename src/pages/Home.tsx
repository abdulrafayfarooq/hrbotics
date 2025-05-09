
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import HRboticsLogo from '@/components/HRboticsLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/interview');
    } else {
      navigate('/login');
    }
  };

  const datasetFiles = [
    { name: 'facial_expressions.json', description: 'Facial emotion markers' },
    { name: 'voice_sentiment.json', description: 'Voice tone analysis' },
    { name: 'interview_questions.csv', description: 'Common interview questions' },
    { name: 'feedback_templates.json', description: 'Feedback generation templates' }
  ];

  return (
    <div className="min-h-screen flex flex-col grid-pattern-bg">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <HRboticsLogo size="lg" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/interview')}
              className="hover:bg-virtualhr-purple-soft hover:text-virtualhr-purple"
            >
              Dashboard
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="hover:bg-virtualhr-purple-soft hover:text-virtualhr-purple"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
        {/* Left side - text content */}
        <div className={`md:w-1/2 space-y-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Ace your next interview with 
            <span className="text-virtualhr-purple"> AI-powered</span> feedback
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Practice interviews with our friendly AI assistant and get instant feedback on your confidence, emotions, and tone. Start building interview confidence today!
          </p>
          <div className="space-x-4 pt-4">
            <Button 
              onClick={handleGetStarted} 
              size="lg"
              className="bg-virtualhr-purple hover:bg-virtualhr-purple-dark text-white px-8"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-virtualhr-purple text-virtualhr-purple hover:bg-virtualhr-purple-soft"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Right side - illustration */}
        <div className={`md:w-1/2 mt-8 md:mt-0 flex justify-center ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md border border-border">
            <div className="bg-virtualhr-purple-soft rounded-lg p-4 mb-4 flex items-center">
              <div className="bg-virtualhr-purple rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-virtualhr-purple-dark">Smart Analysis</h3>
                <p className="text-sm text-gray-600">AI-powered feedback on your performance</p>
              </div>
            </div>
            
            <div className="bg-virtualhr-blue-soft rounded-lg p-4 mb-4 flex items-center">
              <div className="bg-virtualhr-blue-ocean rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-virtualhr-blue-bright">Real-time Insights</h3>
                <p className="text-sm text-gray-600">Moment-by-moment emotional analysis</p>
              </div>
            </div>
            
            <div className="bg-accent rounded-lg p-4 flex items-center">
              <div className="bg-gray-700 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Dataset Integration</h3>
                <p className="text-sm text-gray-600">Pre-trained on industry interview data</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dataset info section */}
      <section className="container mx-auto px-4 py-12 mb-8">
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Interview Dataset</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Training Data</h3>
              <p className="text-muted-foreground mb-4">
                HRbotics uses a proprietary dataset built from thousands of real interview recordings
                (with permission) to train our emotional and sentiment analysis models.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>1,000+ hours of interview footage</li>
                <li>Diverse candidates across industries</li>
                <li>Annotated for emotional cues and sentiment</li>
                <li>Regular updates to improve accuracy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Dataset Files</h3>
              <p className="text-muted-foreground mb-4">
                Our models are trained using structured data files that include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {datasetFiles.map((file, index) => (
                  <Card key={index} className="bg-muted">
                    <CardContent className="p-3">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
