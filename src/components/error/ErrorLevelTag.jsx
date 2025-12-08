import React from "react";

export default function ErrorLevelTag({ level }) {
    let bgColor = '';

    switch (level.toUpperCase()) {
        case 'ERROR':
            bgColor = 'bg-red-500';
            break;
        case 'WARN':
            bgColor = 'bg-yellow-500';
            break;
        case 'INFO':
            bgColor = 'bg-blue-500';
            break;
        default:
            bgColor = 'bg-gray-400';
    }

    return (
        <span className={'px-2 py-1 rounded-full text-white text-xs ${bgColor}'}>
            {level.toUpperCase()}
        </span>
    );
}