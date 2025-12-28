import React, { useRef } from 'react';

interface DropzoneProps {
  label: string;
  accept: string;
  icon: React.ReactNode;
  onFilesAdded: (files: File[]) => void;
  files: { file: File; previewUrl: string }[];
}

export const Dropzone: React.FC<DropzoneProps> = ({ label, accept, icon, onFilesAdded, files }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex-1 border-2 border-dashed border-indigo-200 rounded-2xl bg-white hover:bg-indigo-50 transition-colors cursor-pointer p-6 flex flex-col items-center justify-center min-h-[200px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          multiple 
          accept={accept} 
          onChange={handleChange} 
        />
        
        {files.length === 0 ? (
          <div className="text-center space-y-3">
            <div className="bg-indigo-100 p-4 rounded-full inline-flex text-primary">
              {icon}
            </div>
            <h3 className="font-semibold text-text-main">{label}</h3>
            <p className="text-sm text-text-muted">Przeciągnij lub kliknij</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 w-full max-h-[180px] overflow-y-auto p-2">
            {files.map((f, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                {f.file.type.startsWith('image') ? (
                  <img src={f.previewUrl} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-xs text-text-muted p-1 text-center">
                    <span className="text-2xl mb-1">🎵</span>
                    <span className="truncate w-full">{f.file.name}</span>
                  </div>
                )}
              </div>
            ))}
            <div className="aspect-square rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
              +
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
