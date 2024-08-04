import React from 'react';

const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-400"></div>
    </div>
  );
};

export default LoadingDots;
