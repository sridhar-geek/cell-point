import React from "react";

export const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};


export const Bounce = () => {
  return (
    <span className="inline-flex">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce [animation-delay:200ms]">.</span>
      <span className="animate-bounce [animation-delay:400ms]">.</span>
    </span>
  );
};