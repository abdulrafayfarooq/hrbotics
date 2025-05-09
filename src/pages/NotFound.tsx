
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background grid-pattern-bg p-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-virtualhr-purple font-bold text-8xl">404</div>
          <h1 className="text-3xl font-bold mt-2">Page not found</h1>
        </div>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button 
            onClick={() => navigate('/')}
            className="bg-virtualhr-purple hover:bg-virtualhr-purple-dark"
          >
            Back to Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
