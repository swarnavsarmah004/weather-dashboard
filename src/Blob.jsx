import React from "react";

export default function Blob() {
  return (
    <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
      <div className="absolute w-72 h-72 bg-purple-400 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
      <div className="absolute w-72 h-72 bg-pink-400 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute w-72 h-72 bg-yellow-400 opacity-30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>
    </div>
  );
}
