import React, { useEffect, useRef, useState } from 'react';
import { Exercise, EXERCISE_TYPES } from '../types';
import { Icons } from '../utils/icons';

interface WorkoutProps {
  exercises: Exercise[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  uploadedImages: Record<string, string>;
}

export const Workout: React.FC<WorkoutProps> = ({
  exercises,
  currentIndex,
  onNext,
  onPrev,
  onExit,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  uploadedImages
}) => {
  const currentEx = exercises[currentIndex];
  const scrollRef = useRef<HTMLDivElement>(null);

  // Logic to find the best image sources (supports multiple)
  const imageSources = (() => {
    const uploadedFilenames = Object.keys(uploadedImages);
    const foundImages: string[] = [];

    // Helper: Checks if a filename (from user) matches a target (title or alias)
    // Ignores case and extensions (e.g. "przyciaganie.webp" matches "przyciaganie")
    const matches = (filename: string, target: string) => {
      const baseName = filename.toLowerCase().split('.')[0];
      const t = target.toLowerCase().trim();
      return baseName === t || baseName.includes(t);
    };

    // 1. Check all 'imageFileNames' aliases and collect ALL matches
    if (currentEx.imageFileNames && currentEx.imageFileNames.length > 0) {
      currentEx.imageFileNames.forEach(alias => {
        const found = uploadedFilenames.filter(fname => matches(fname, alias));
        found.forEach(f => foundImages.push(uploadedImages[f]));
      });
    }

    // 2. Check exact Title if nothing found yet (or supplement it)
    if (foundImages.length === 0) {
        const titleMatch = uploadedFilenames.find(fname => matches(fname, currentEx.Tytuł));
        if (titleMatch) foundImages.push(uploadedImages[titleMatch]);
    }

    // 3. Static Fallback if still empty
    // If we have static build, we assume file exists in public/images
    if (foundImages.length === 0) {
        const fallbackName = currentEx.imageFileNames?.[0] || currentEx.Tytuł;
        foundImages.push(`images/${fallbackName}.png`);
    }

    // Return unique values only
    return [...new Set(foundImages)];
  })();

  // Scroll to top on exercise change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // Swipe logic
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].screenX;
      const endY = e.changedTouches[0].screenY;
      
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > 75 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) onNext();
        else onPrev();
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onNext, onPrev]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const buildRepsString = (ex: Exercise) => {
    if (ex.Param_type === 'time') {
      const min = Math.floor(ex.Param_duration_sec / 60);
      const sec = ex.Param_duration_sec % 60;
      const timeStr = min > 0 ? (sec > 0 ? `${min} min ${sec} sek` : `${min} min`) : `${sec} sek`;
      return `${ex.Param_sets} x ${timeStr}`;
    }
    return ex.Param_sets === 1 ? `${ex.Param_reps} powtórzeń` : `${ex.Param_sets} serie po ${ex.Param_reps} powt.`;
  };

  const typeConfig = EXERCISE_TYPES[currentEx.Typ_PL];

  return (
    <div className="flex flex-col h-screen bg-bg-page overflow-hidden">
      {/* Header */}
      <div className="flex-none bg-primary text-white p-4 pb-6 relative z-10 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onExit} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <Icons.ArrowLeft />
          </button>
          <div className="font-mono font-bold text-lg">
            {currentIndex + 1} / {exercises.length}
          </div>
          <div className="w-8"></div>
        </div>
        {/* Progress Bar */}
        <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        id="workout-scroll"
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-32 animate-fade-in"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-main leading-tight mb-2">{currentEx.Tytuł}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border"
              style={{ backgroundColor: typeConfig.bg, color: typeConfig.color, borderColor: typeConfig.border }}
            >
              {currentEx.Typ_PL}
            </span>
            <span className="text-sm text-text-muted font-medium">{currentEx.Cel_Target}</span>
          </div>
        </div>

        {/* Image Container */}
        {/* CHANGED: Fixed height relative to viewport (40vh) instead of aspect ratio, bg-white to match drawings */}
        <div className="w-full h-[40vh] min-h-[300px] bg-white rounded-2xl mb-6 flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm overflow-hidden relative p-1">
           {imageSources.length > 0 ? (
             <div className={`w-full h-full grid gap-1 ${imageSources.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
               {imageSources.map((src, idx) => (
                  <div key={idx} className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-white">
                    <img 
                      src={src} 
                      className="max-w-full max-h-full object-contain" // Ensures image is never cropped and fits inside
                      alt={`${currentEx.Tytuł} - część ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
               ))}
             </div>
           ) : (
             /* Fallback Content */
             <div 
                className="placeholder-content flex flex-col items-center justify-center absolute inset-0 bg-slate-50"
             >
               <svg className="w-12 h-12 mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
               <span className="text-xs font-semibold uppercase tracking-wider text-center px-4 text-slate-400">Brak rysunku</span>
               <div className="flex flex-col items-center mt-2 max-w-[80%]">
                   <span className="text-[10px] text-slate-400 text-center">
                     Oczekiwany plik:
                   </span>
                   <code className="text-[10px] font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-500 mt-1 truncate w-full text-center">
                      {currentEx.imageFileNames?.[0] || currentEx.Tytuł}
                   </code>
                 </div>
             </div>
           )}
        </div>

        {/* Action Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 mb-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-slate-300">
            <Icons.Activity />
            <span className="font-bold text-lg">{buildRepsString(currentEx)}</span>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="font-mono text-3xl font-bold tracking-widest tabular-nums pl-2">
              {formatTime(timerSeconds)}
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={onToggleTimer}
                 className={`p-3 rounded-lg transition-colors ${isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
               >
                 {isTimerRunning ? <Icons.Pause /> : <Icons.Play />}
               </button>
               <button 
                 onClick={onResetTimer}
                 className="p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
               >
                 <Icons.Stop />
               </button>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 gap-3 mb-6 text-sm">
          <div className="flex gap-2">
             <span className="text-text-muted">📍 <strong>Pozycja:</strong></span>
             <span className="text-text-main">{currentEx.Pozycja_wyjściowa}</span>
          </div>
          <div className="flex gap-2">
             <span className="text-text-muted">🎯 <strong>Partia:</strong></span>
             <span className="text-text-main">{currentEx.Partia_mięśniowa}</span>
          </div>
          {currentEx.Sprzęt && (
            <div className="flex gap-2">
               <span className="text-text-muted">🔧 <strong>Sprzęt:</strong></span>
               <span className="text-text-main">{currentEx.Sprzęt}</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-6">
          <h3 className="font-bold text-text-main text-lg border-b border-slate-200 pb-2">Instrukcje</h3>
          <ul className="space-y-3">
            {currentEx.Instructions_JSON.map((step, i) => (
              <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5 border border-slate-200">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Alert */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-4">
          <div className="flex items-start gap-3">
            <div className="text-red-500 mt-0.5"><Icons.AlertTriangle /></div>
            <div>
              <strong className="block text-red-800 text-sm font-bold uppercase mb-1">WAŻNE</strong>
              <p className="text-red-700 text-sm font-medium">{currentEx.Uwaga_krytyczna}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex-none bg-white border-t border-slate-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
         <button 
           onClick={onPrev}
           disabled={currentIndex === 0}
           className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-semibold text-slate-600 disabled:opacity-30 flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all"
         >
           <Icons.ChevronLeft /> Poprzednie
         </button>
         <button 
           onClick={onNext}
           disabled={currentIndex === exercises.length - 1}
           className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:bg-slate-300 flex items-center justify-center gap-2 shadow-lg hover:bg-primary-dark active:scale-95 transition-all"
         >
           Następne <Icons.ChevronRight />
         </button>
      </div>
    </div>
  );
};