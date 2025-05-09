
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';

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

  return (
    <div className="min-h-screen flex flex-col grid-pattern-bg">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-virtualhr-purple">VirtualHR</div>
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
      </header>

      <main className="flex-1 container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
        {/* Left side - text content */}
        <div className={`md:w-1/2 space-y-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Ace your next interview with 
            <span className="text-virtualhr-purple"> AI-powered</span> feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
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
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
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
            
            <div className="bg-gray-100 rounded-lg p-4 flex items-center">
              <div className="bg-gray-700 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Resume Analysis</h3>
                <p className="text-sm text-gray-600">Upload your resume for tailored tips</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
