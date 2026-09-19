import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  const TOTAL_DURATION = 4000; // 4 Seconds exact loading
  const UPDATE_INTERVAL = 30; // Update every 30ms

  useEffect(() => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, (elapsed / TOTAL_DURATION) * 100);

      setProgress(calculatedProgress);

      if (elapsed >= TOTAL_DURATION) {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500); // 0.5s smooth fade out
        }, 150);
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Circle progress calculations (Radius = 110 => Circumference ~ 691.15)
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white text-black selection:bg-[#002DC2] transition-opacity duration-500 ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="relative flex flex-col items-center justify-center space-y-6 px-6 text-center max-w-md mx-auto">
        
        {/* Big Logo with Circular Progress Ring */}
        <div className="relative flex items-center justify-center">
          
          {/* SVG Circular Progress Bar */}
          <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90 drop-shadow-sm" viewBox="0 0 240 240">
            <defs>
              <linearGradient id="circleProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#123B92" />
                <stop offset="50%" stopColor="#002DC2" />
                <stop offset="100%" stopColor="#23AC39" />
              </linearGradient>
            </defs>

            {/* Background Track Circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#F0F4FD"
              strokeWidth="8"
              fill="transparent"
            />

            {/* Active Circular Progress Ring */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="url(#circleProgressGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
            />
          </svg>

          {/* Big Emblem Logo Centered Inside Circle */}
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <img
              src="/emblem.png"
              alt="ZeniTEK Logo"
              className="w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Circular Format Percentage Pill */}
        <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[#F0F4FD] border border-[#123B92]/30 shadow-sm text-black text-xs font-extrabold font-mono tracking-wide">
          <span className="w-2.5 h-2.5 rounded-full bg-[#23AC39] animate-pulse"></span>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* Clean Brand Typography */}
        <div className="space-y-1.5 pt-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#123B92] flex items-center justify-center">
            <span>Zeni</span>
            <span className="text-[#002DC2]">TEK</span>
            <span className="ml-2.5 text-[11px] font-extrabold uppercase tracking-widest text-white bg-[#23AC39] px-2.5 py-0.5 rounded border border-[#23AC39]">
              Solar
            </span>
          </h1>
          <p className="text-xs font-semibold text-black/70 tracking-wider uppercase">
            Towards Sustainable Future
          </p>
        </div>

        {/* Sub-tagline */}
        <div className="text-[10px] text-black/60 font-bold uppercase tracking-widest pt-2">
          MNRE Approved • ISO 9001:2015 Certified
        </div>

      </div>
    </div>
  );
}

