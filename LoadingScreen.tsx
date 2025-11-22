import React from 'react';
import { ThemeConfig } from '../themes';

interface LoadingScreenProps {
  message?: string;
  theme: ThemeConfig;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Creating your companion...", theme }) => {
  const gradientStyle = {
    background: `linear-gradient(-45deg, ${theme.gradientColors.join(', ')})`,
    backgroundSize: '400% 400%',
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-full w-full p-8 text-center animate-gradient"
      style={gradientStyle}
    >
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute inset-2 rounded-full border-t-2 border-white animate-[spin_2s_linear_infinite]"></div>
        <div className="absolute inset-8 rounded-full bg-white/20 animate-pulse blur-md"></div>
        <div className="absolute inset-8 rounded-full bg-white/10 animate-pulse"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        Generating Persona
      </h2>
      <p className="text-white/80 max-w-xs mx-auto" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
        {message}
      </p>
      <p className="text-xs text-white/50 mt-4">
        Powered by Google Gemini & Imagen
      </p>
    </div>
  );
};
