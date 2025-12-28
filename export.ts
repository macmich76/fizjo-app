import { Exercise, FileWithPreview } from "../types";

export const generateHtmlFile = (plan: Exercise[], images: FileWithPreview[]): string => {
  const date = new Date().toLocaleDateString('pl-PL');
  
  // Helper to find image data by index or name
  const getImagesForExercise = (indicesOrNames: (string | number)[]): string[] => {
    return indicesOrNames.map(idx => {
      // If it's a number (from AI generation)
      if (typeof idx === 'number') {
        return images[idx]?.base64 || '';
      }
      // If it's a string (from demo data), we likely don't have the file loaded
      // In a real scenario with filename matching, we'd search by name.
      return ''; 
    }).filter(s => s !== '');
  };

  const exerciseCards = plan.map((ex, i) => {
    const imgs = getImagesForExercise(ex.matchedImageIdx || []);
    
    // Create image grid HTML
    let imageHtml = '';
    if (imgs.length > 0) {
      imageHtml = `<div class="image-grid">
        ${imgs.map(src => `<img src="${src}" alt="Exercise Image" />`).join('')}
      </div>`;
    } else {
      imageHtml = `<div class="placeholder-box">
         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #cbd5e1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
         <p>Brak zdjęcia</p>
      </div>`;
    }

    return `
      <div class="card">
        ${imageHtml}
        <div class="card-content">
          <div class="header">
            <span class="badge">${ex.type || ''}</span>
            <h2>${i + 1}. ${ex.title || ''}</h2>
          </div>
          
          <div class="meta-grid">
            <div class="meta-item">
              <strong>Cel:</strong> ${ex.target || ''}
            </div>
            <div class="meta-item">
              <strong>Dawkowanie:</strong> ${ex.reps || ''}
            </div>
          </div>

          <div class="instructions">
            <h3>Instrukcja:</h3>
            <ul>
              ${(ex.instructions || []).map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>

          <div class="critical">
            <strong>⚠️ WAŻNE:</strong> ${ex.critical || ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plan Fizjoterapeutyczny - ${date}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { color: #6366f1; text-align: center; margin-bottom: 40px; }
    .card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 30px; page-break-inside: avoid; }
    .image-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2px; background: #e2e8f0; }
    .image-grid img { width: 100%; height: 300px; object-fit: cover; display: block; }
    .placeholder-box { width: 100%; height: 200px; background: #f1f5f9; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; }
    .card-content { padding: 24px; }
    .header { margin-bottom: 20px; }
    .badge { background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; display: inline-block; margin-bottom: 8px; }
    h2 { margin: 0; font-size: 24px; color: #1e293b; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 12px; }
    .meta-item strong { display: block; color: #64748b; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .instructions h3 { font-size: 16px; margin-bottom: 12px; }
    ul { padding-left: 20px; color: #334155; line-height: 1.6; }
    li { margin-bottom: 8px; }
    .critical { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; color: #991b1b; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Twój Plan Rehabilitacji (${date})</h1>
    ${exerciseCards}
    <div style="text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px;">
      Wygenerowano przez Fizjo Studio AI
    </div>
  </div>
</body>
</html>
  `;
};