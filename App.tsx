import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Exercise, ExerciseType, EXERCISES, GITHUB_BASE_URL } from './types';
import { Planner } from './components/Planner';
import { Workout } from './components/Workout';
import { getImagesFromDB, saveImageToDB, clearImagesFromDB } from './utils/db';

// --- HELPERS ---

const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const vibrate = (ms = 50) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(ms);
  }
};

// --- APP COMPONENT ---

const App: React.FC = () => {
  // --- STATE ---
  const [view, setView] = useState<'planner' | 'workout'>('planner');
  const [filter, setFilter] = useState<ExerciseType | 'all'>('all');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  // Store uploaded images: Filename -> BlobURL
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({}); 
  
  // Workout State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const wakeLock = React.useRef<WakeLockSentinel | null>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fizjo_plan');
      if (saved) {
        const ids = JSON.parse(saved) as number[];
        const exercises = ids
          .map(id => EXERCISES.find(e => e.Global_ID === id))
          .filter((e): e is Exercise => !!e);
        setSelectedExercises(exercises);
      }
    } catch (e) {
      console.error('Błąd odczytu planu:', e);
    }
  }, []);

  // --- IMAGE DB LOADING (On Start) ---
  useEffect(() => {
    const initImages = async () => {
      try {
        const cached = await getImagesFromDB();
        setUploadedImages(prev => ({ ...prev, ...cached }));
        
        // AUTO-DOWNLOAD FEATURE:
        // Identify exercises that need images but are not in cache
        const downloads = EXERCISES
          .map(ex => {
            // Determine the target download URL
            let targetUrl = ex.Remote_URL;
            let filename = '';

            // Priority 1: Specific Remote_URL (if exists)
            if (targetUrl) {
               filename = `${ex.Tytuł}.jpg`; // Fallback name
            } 
            // Priority 2: Construct from GITHUB_BASE_URL using Alias
            else if (GITHUB_BASE_URL && ex.imageFileNames?.[0]) {
               const alias = ex.imageFileNames[0];
               // CHANGED: Use .webp as default since user uploaded webp files
               targetUrl = `${GITHUB_BASE_URL}${alias}.webp`;
               filename = `${alias}.webp`;
            }

            // If we have no URL or already have the file, skip
            if (!targetUrl || cached[filename] || cached[ex.Tytuł] || cached[`${ex.Tytuł}.jpg`] || cached[`${ex.Tytuł}.webp`]) {
              return null;
            }

            return { url: targetUrl, filename, title: ex.Tytuł };
          })
          .filter((item): item is { url: string; filename: string; title: string } => item !== null)
          .map(async ({ url, filename, title }) => {
            try {
              console.log(`Pobieranie: ${title} z ${url}`);
              const resp = await fetch(url);
              if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
              const blob = await resp.blob();
              
              await saveImageToDB(filename, blob);
              return { name: filename, blob };
            } catch (err) {
              console.error(`Błąd pobierania ${title}:`, err);
              return null;
            }
          });
        
        if (downloads.length > 0) {
          const results = await Promise.all(downloads);
          const newMap: Record<string, string> = {};
          results.forEach(res => {
            if (res) newMap[res.name] = URL.createObjectURL(res.blob);
          });
          setUploadedImages(prev => ({ ...prev, ...newMap }));
          if (Object.keys(newMap).length > 0) {
             console.log("Pobrano nowe zdjęcia online!");
          }
        }

      } catch (e) {
        console.error("Błąd ładowania bazy zdjęć:", e);
      }
    };
    initImages();
  }, []);

  const savePlan = (exercises: Exercise[]) => {
    try {
      const ids = exercises.map(e => e.Global_ID);
      localStorage.setItem('fizjo_plan', JSON.stringify(ids));
    } catch (e) {
      console.error('Błąd zapisu planu:', e);
    }
  };

  const updateSelected = (newSelection: Exercise[]) => {
    setSelectedExercises(newSelection);
    savePlan(newSelection);
  };

  // --- IMAGE UPLOAD LOGIC (With Persistence) ---
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    let count = 0;
    const newMap: Record<string, string> = {};

    // Save to DB
    for (const file of Array.from(files)) {
      try {
        await saveImageToDB(file.name, file);
        newMap[file.name] = URL.createObjectURL(file);
        count++;
      } catch (err) {
        console.error("Błąd zapisu zdjęcia:", file.name, err);
      }
    }

    setUploadedImages(prev => ({ ...prev, ...newMap }));
    vibrate();
    alert(`✅ Sukces! Zapisano ${count} plików w Pamięci Trwałej Aplikacji.\n\nBędą dostępne nawet po restarcie telefonu.`);
  };

  // --- AUTO PLAN LOGIC ---

  const autoPlanStabilizacja = () => {
    // 2 random Rozciąganie + All Session 4
    const rozciaganie = EXERCISES.filter(ex => ex.Typ_PL === 'Rozciąganie');
    const session4 = EXERCISES.filter(ex => ex.Sesja === 4);
    
    const randomRozciaganie = shuffle(rozciaganie).slice(0, 2);
    
    const newPlan = [...randomRozciaganie, ...session4];
    updateSelected(newPlan);
    vibrate();
  };

  const autoPlanInne = () => {
    // Session 1-3 only
    const pool = EXERCISES.filter(ex => ex.Sesja !== 4);
    
    const rozciaganie = pool.filter(ex => ex.Typ_PL === 'Rozciąganie');
    const mobilizacja = pool.filter(ex => ex.Typ_PL === 'Mobilizacja');
    const sila = pool.filter(ex => ex.Typ_PL === 'Siła');
    
    const randomR = shuffle(rozciaganie).slice(0, 3);
    const randomM = shuffle(mobilizacja).slice(0, 3);
    const randomS = shuffle(sila).slice(0, 3);
    
    const newPlan = [...randomR, ...randomM, ...randomS];
    updateSelected(newPlan);
    vibrate();
  };

  const toggleExercise = (id: number) => {
    const idx = selectedExercises.findIndex(e => e.Global_ID === id);
    let newSelection = [...selectedExercises];
    if (idx > -1) {
      newSelection.splice(idx, 1);
    } else {
      const ex = EXERCISES.find(e => e.Global_ID === id);
      if (ex) newSelection.push(ex);
    }
    updateSelected(newSelection);
    vibrate(20);
  };

  const moveExercise = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < selectedExercises.length) {
      const newSelection = [...selectedExercises];
      [newSelection[index], newSelection[newIndex]] = [newSelection[newIndex], newSelection[index]];
      updateSelected(newSelection);
    }
  };

  // --- WAKE LOCK & WORKOUT LOGIC ---

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLock.current = await navigator.wakeLock.request('screen');
      } catch (err) {
        console.error('Wake Lock failed:', err);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLock.current) {
      await wakeLock.current.release();
      wakeLock.current = null;
    }
  };

  const startWorkout = () => {
    if (selectedExercises.length === 0) return;
    setCurrentIndex(0);
    resetTimer();
    setView('workout');
    requestWakeLock();
    vibrate();
  };

  const exitWorkout = () => {
    releaseWakeLock();
    setIsTimerRunning(false);
    setView('planner');
  };

  const nextExercise = useCallback(() => {
    if (currentIndex < selectedExercises.length - 1) {
      vibrate();
      setCurrentIndex(c => c + 1);
      resetTimer();
    }
  }, [currentIndex, selectedExercises.length]);

  const prevExercise = useCallback(() => {
    if (currentIndex > 0) {
      vibrate();
      setCurrentIndex(c => c - 1);
      resetTimer();
    }
  }, [currentIndex]);

  // --- TIMER LOGIC ---

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    vibrate(30);
    if (!isTimerRunning) requestWakeLock(); // ensure lock on play
    setIsTimerRunning(prev => !prev);
  };

  const resetTimer = () => {
    vibrate(30);
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  // --- RE-REQUEST WAKE LOCK ON VISIBILITY CHANGE ---
  useEffect(() => {
    const handleVisChange = () => {
      if (document.visibilityState === 'visible' && view === 'workout') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, [view]);

  return (
    <div className="font-sans text-text-main bg-bg-page min-h-screen">
      {view === 'planner' && (
        <Planner
          filter={filter}
          setFilter={setFilter}
          selectedExercises={selectedExercises}
          onToggleExercise={toggleExercise}
          onAutoPlanStabilizacja={autoPlanStabilizacja}
          onAutoPlanInne={autoPlanInne}
          onClearAll={() => updateSelected([])}
          onMoveExercise={moveExercise}
          onStartWorkout={startWorkout}
          onUploadImages={handleImageUpload}
        />
      )}

      {view === 'workout' && selectedExercises.length > 0 && (
        <Workout
          exercises={selectedExercises}
          currentIndex={currentIndex}
          onNext={nextExercise}
          onPrev={prevExercise}
          onExit={exitWorkout}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          onToggleTimer={toggleTimer}
          onResetTimer={resetTimer}
          uploadedImages={uploadedImages}
        />
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);