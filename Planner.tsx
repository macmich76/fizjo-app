import React, { useRef } from 'react';
import { Exercise, ExerciseType, EXERCISE_TYPES, EXERCISES } from '../types';
import { Icons } from '../utils/icons';

interface PlannerProps {
  filter: ExerciseType | 'all';
  setFilter: (f: ExerciseType | 'all') => void;
  selectedExercises: Exercise[];
  onToggleExercise: (id: number) => void;
  onAutoPlanStabilizacja: () => void;
  onAutoPlanInne: () => void;
  onClearAll: () => void;
  onMoveExercise: (index: number, direction: -1 | 1) => void;
  onStartWorkout: () => void;
  onUploadImages: (files: FileList | null) => void;
}

export const Planner: React.FC<PlannerProps> = ({
  filter,
  setFilter,
  selectedExercises,
  onToggleExercise,
  onAutoPlanStabilizacja,
  onAutoPlanInne,
  onClearAll,
  onMoveExercise,
  onStartWorkout,
  onUploadImages
}) => {
  const selectedIds = new Set(selectedExercises.map(e => e.Global_ID));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableExercises = EXERCISES.filter(ex => {
    if (selectedIds.has(ex.Global_ID)) return false; // Already selected
    if (filter === 'all') return true;
    return ex.Typ_PL === filter;
  });

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="header sticky top-0 z-20 bg-bg-page/95 backdrop-blur border-b border-border py-4 px-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-primary"><Icons.List /></div>
          <h1 className="text-2xl font-bold text-text-main">Zaplanuj</h1>
        </div>
        
        {/* Discreet Upload Button for Browser Preview */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
          title="Wczytaj zdjęcia z dysku (Auto-dopasowanie)"
        >
          <span className="text-xl leading-none">📂</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUploadImages(e.target.files);
            }
            // CRITICAL FIX: Reset value to allow selecting the same files again if needed
            e.target.value = '';
          }} 
          multiple 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {/* Filters */}
      <div className="filters sticky top-[73px] z-10 bg-bg-page/95 backdrop-blur py-3 px-4 border-b border-border overflow-x-auto no-scrollbar flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            filter === 'all' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-white text-text-muted border border-border hover:bg-slate-50'
          }`}
        >
          Wszystkie
        </button>
        {(Object.keys(EXERCISE_TYPES) as ExerciseType[]).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
              filter === type
                ? 'shadow-sm' // Dynamic colors handled by style prop
                : 'bg-white text-text-muted border-border hover:bg-slate-50'
            }`}
            style={filter === type ? {
              backgroundColor: EXERCISE_TYPES[type].bg,
              borderColor: EXERCISE_TYPES[type].border,
              color: EXERCISE_TYPES[type].color
            } : {}}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-6">
        {/* Auto Plan Buttons */}
        {selectedExercises.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={onAutoPlanStabilizacja}
              className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="text-blue-600"><Icons.Target /></div>
              <span className="font-bold text-blue-800">Stabilizacja</span>
            </button>
            <button 
              onClick={onAutoPlanInne}
              className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="text-emerald-600"><Icons.Dumbbell /></div>
              <span className="font-bold text-emerald-800">Inne ćwiczenia</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={onClearAll}
            className="w-full flex items-center justify-center gap-2 p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
          >
            <Icons.Wand /> Odznacz wszystkie
          </button>
        )}

        {/* Selected Exercises */}
        {selectedExercises.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Wybrane ({selectedExercises.length})</h2>
            {selectedExercises.map((ex, idx) => (
              <div key={ex.Global_ID} className="bg-white border-l-4 border-primary rounded-r-xl shadow-sm p-4 flex items-center gap-3 relative overflow-hidden group">
                <div 
                  onClick={() => onToggleExercise(ex.Global_ID)}
                  className="flex-shrink-0 w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center cursor-pointer"
                >
                  <Icons.Check />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-main truncate">{ex.Tytuł}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-primary bg-blue-50 px-1.5 rounded">#{idx + 1}</span>
                    <span 
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: EXERCISE_TYPES[ex.Typ_PL].bg,
                        color: EXERCISE_TYPES[ex.Typ_PL].color,
                        borderColor: EXERCISE_TYPES[ex.Typ_PL].border
                      }}
                    >
                      {ex.Typ_PL}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onMoveExercise(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                     <div className="rotate-90"><Icons.ChevronLeft /></div>
                  </button>
                  <button 
                    onClick={() => onMoveExercise(idx, 1)}
                    disabled={idx === selectedExercises.length - 1}
                    className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                     <div className="rotate-90"><Icons.ChevronRight /></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedExercises.length > 0 && availableExercises.length > 0 && (
          <div className="border-t border-dashed border-slate-300 my-4"></div>
        )}

        {/* Available Exercises */}
        {availableExercises.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider ml-1">Dostępne</h2>
            {availableExercises.map(ex => (
              <div 
                key={ex.Global_ID} 
                onClick={() => onToggleExercise(ex.Global_ID)}
                className="bg-white border border-border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-slate-300"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-main">{ex.Tytuł}</h3>
                  <span 
                    className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: EXERCISE_TYPES[ex.Typ_PL].bg,
                      color: EXERCISE_TYPES[ex.Typ_PL].color,
                      borderColor: EXERCISE_TYPES[ex.Typ_PL].border
                    }}
                  >
                    {ex.Typ_PL}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      {selectedExercises.length > 0 && (
        <div className="bottom-bar fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg flex justify-center backdrop-blur-md bg-white/90">
          <button 
            onClick={onStartWorkout}
            className="bg-primary text-white text-lg font-bold px-8 py-3 rounded-2xl shadow-xl flex items-center gap-3 hover:bg-primary-dark transition-all active:scale-95 w-full max-w-md justify-center"
          >
            <Icons.Play /> Rozpocznij ({selectedExercises.length})
          </button>
        </div>
      )}
    </div>
  );
};