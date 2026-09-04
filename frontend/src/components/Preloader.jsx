import React, { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing ZeniTEK Solar Engine...');
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const statusMessages = [
      { at: 15, text: 'Initializing Solar Thermal Technology...' },
      { at: 40, text: 'Loading MNRE Approved Site Data...' },
      { at: 70, text: 'Configuring Precision Heat Controls...' },
      { at: 90, text: 'Preparing Sustainable Future...' },
      { at: 100, text: 'Welcome to ZeniTEK Solar' }
    ];

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadingOut(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600); // fade out duration
          }, 300);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        const currentTarget = Math.min(next, 100);

        const currentMsg = statusMessages.find(m => currentTarget >= m.at);
        if (currentMsg) {
          setStatusText(currentMsg.text);
        }

        return currentTarget;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-950 text-white selection:bg-blue-600 transition-opacity duration-700 ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Background Animated Gradient Aura */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-green-600/20 via-blue-600/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm px-6 text-center">
        
        {/* Emblem Logo Container with Pulsing Ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer Rotating Glowing Ring */}
          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-green-500/40 animate-spin-slow" />
          <div className="absolute -inset-8 rounded-full border border-blue-500/20 animate-ping" />

          {/* Center Emblem Logo */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-900/80 backdrop-blur-xl p-3 border border-slate-800 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
            <img
              src="/emblem.png"
              alt="ZeniTEK Emblem"
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center">
            <span>Zeni</span>
            <span className="text-green-500">TEK</span>
            <span className="ml-2 text-xs font-bold uppercase tracking-widest text-green-400 bg-green-950/80 px-2 py-0.5 rounded border border-green-800">
              Solar
            </span>
          </h1>
          <p className="text-xs font-semibold text-slate-400 tracking-wider">
            Towards Sustainable Future
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-2 pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
            <span className="truncate max-w-[220px] text-left">{statusText}</span>
            <span className="text-green-400">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-green-500 to-emerald-400 rounded-full transition-all duration-150 ease-out shadow-lg shadow-green-500/30"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Trust Tag */}
        <div className="pt-4 text-[10px] text-slate-500 font-medium tracking-widest uppercase">
          MNRE Approved • ISO 9001:2015 Certified
        </div>

      </div>
    </div>
  );
}
