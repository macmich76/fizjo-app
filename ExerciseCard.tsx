import React from 'react';
import { Exercise, FileWithPreview } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  allImages: FileWithPreview[];
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index, allImages }) => {
  // Logic to find valid images based on AI Output
  const matchedImages = (exercise.matchedImageIdx || []).map(idx => {
    if (typeof idx === 'number') return allImages[idx];
    // If it's a filename string (from Demo Data), we usually can't show it unless we have those specific files loaded.
    // For the demo purpose requested, we show placeholder if string.
    return undefined;
  }).filter(Boolean) as FileWithPreview[];

  return (
    <div className="bg-white rounded-[1.25rem] shadow-sm overflow-hidden border border-slate-100 mb-8">
      {/* Visual Header */}
      <div className="w-full bg-slate-100 relative min-h-[250px]">
        {matchedImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-1 h-full max-h-[400px]">
             {matchedImages.map((img, i) => (
               <img 
                key={i} 
                src={img.previewUrl} 
                className={`w-full h-full object-cover ${matchedImages.length === 1 ? 'col-span-2' : ''}`}
                alt={exercise.title || 'Exercise'} 
               />
             ))}
          </div>
        ) : (
          <div className="w-full h-[250px] flex flex-col items-center justify-center text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
             <p className="mt-4 text-sm font-medium">Zdjęcie niedostępne (Dane demonstracyjne)</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-50 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-2">
              {exercise.type}
            </span>
            <h3 className="text-2xl font-bold text-text-main">
              <span className="text-slate-300 mr-2">#{index + 1}</span>
              {exercise.title}
            </h3>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-bg-page p-4 rounded-xl">
            <span className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Cel</span>
            <p className="text-text-main font-medium">{exercise.target}</p>
          </div>
          <div className="bg-bg-page p-4 rounded-xl">
            <span className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Dawkowanie</span>
            <p className="text-text-main font-medium">{exercise.reps}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            Instrukcja
          </h4>
          <ul className="space-y-3">
            {(exercise.instructions || []).map((step, i) => (
              <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Safety Info */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <strong className="block text-red-800 text-sm font-bold uppercase mb-1">Kluczowe dla bezpieczeństwa</strong>
              <p className="text-red-700 text-sm">{exercise.critical}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};