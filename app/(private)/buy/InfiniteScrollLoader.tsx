import React from "react";

const InfiniteScrollLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2 p-4">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  );
};

export default InfiniteScrollLoader;
