import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const spinnerSize = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${spinnerSize} animate-spin text-blue rounded-full border-4 border-primary border-t-transparent`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};