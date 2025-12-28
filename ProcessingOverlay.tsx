import React from 'react';

export const ProcessingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-indigo-100 border-t-primary rounded-full animate-spin mb-8"></div>
      <h2 className="text-2xl font-bold text-text-main mb-2">Analiza Materiału...</h2>
      <p className="text-text-muted text-center max-w-md">
        AI przesłuchuje notatki głosowe i łączy je ze zdjęciami. To może potrwać do minuty.
      </p>
    </div>
  );
};
