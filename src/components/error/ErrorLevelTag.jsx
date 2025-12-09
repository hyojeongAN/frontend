import React from "react";

export default function ErrorLevelTag({ level }) {
  let bgColor = ''; 

  switch (level.toUpperCase()) { 
    case 'ERROR':
      bgColor = 'text-red-500'; 
      break;
    case 'WARN':
      bgColor = 'text-yellow-500'; 
      break;
    case 'INFO':
      bgColor = 'text-blue-500'; 
      break;
    default:
      bgColor = 'text-gray-400';
  }

  return (
    <span className={`px-2 py-1 text-xs ${bgColor}`}>
      {level.toUpperCase()}
    </span>
  );
}