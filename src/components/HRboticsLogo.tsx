
import React from 'react';

interface HRboticsLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

const HRboticsLogo: React.FC<HRboticsLogoProps> = ({ 
  size = 'md', 
  variant = 'full'
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return { width: variant === 'full' ? 120 : 28, height: variant === 'full' ? 32 : 28 };
      case 'lg': return { width: variant === 'full' ? 180 : 42, height: variant === 'full' ? 48 : 42 };
      default: return { width: variant === 'full' ? 150 : 36, height: variant === 'full' ? 40 : 36 };
    }
  };

  const { width, height } = getSize();

  return (
    <div className="inline-flex items-center">
      <div className="flex items-center justify-center bg-virtualhr-purple rounded-lg p-1 mr-2">
        <svg 
          width={variant === 'full' ? width / 5 : width} 
          height={variant === 'full' ? height : height}
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="6" fill="currentColor" className="text-virtualhr-purple" />
          <path
            d="M7 9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9z"
            fill="white"
          />
          <circle cx="12" cy="8" r="1.5" fill="white" />
          <circle cx="17" cy="12" r="1.5" fill="white" />
          <circle cx="12" cy="16" r="1.5" fill="white" />
          <circle cx="7" cy="12" r="1.5" fill="white" />
        </svg>
      </div>
      {variant === 'full' && (
        <span className="text-xl font-bold bg-gradient-to-r from-virtualhr-purple to-virtualhr-purple-dark bg-clip-text text-transparent">
          HRbotics
        </span>
      )}
    </div>
  );
};

export default HRboticsLogo;
