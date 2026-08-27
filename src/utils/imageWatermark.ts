import { validateListingImage } from './pendingUploadImages';

export interface ProcessedListingImage {
  file: File;
  width: number;
  height: number;
  mimeType: string;
  size: number;
}

const MAX_DIMENSION = 2560;

export async function applyRentouraWatermark(source: File): Promise<ProcessedListingImage> {
  const validationError = validateListingImage(source);
  if (validationError) throw new Error(validationError);

  const bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot process listing images.');
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const fontSize = Math.max(18, Math.min(64, Math.round(width * 0.035)));
  const padding = Math.max(14, Math.round(fontSize * 0.75));
  context.save();
  context.font = `700 ${fontSize}px system-ui, sans-serif`;
  context.textAlign = 'right';
  context.textBaseline = 'bottom';
  context.globalAlpha = 0.68;
  context.lineWidth = Math.max(1, fontSize * 0.06);
  context.strokeStyle = 'rgba(0,0,0,0.45)';
  context.fillStyle = '#ffffff';
  context.strokeText('RENTOURA.LK', width - padding, height - padding);
  context.fillText('RENTOURA.LK', width - padding, height - padding);
  context.restore();

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
    result => result ? resolve(result) : reject(new Error('Image processing failed.')),
    'image/webp',
    0.88,
  ));
  const file = new File([blob], `${crypto.randomUUID()}.webp`, { type: 'image/webp' });
  return { file, width, height, mimeType: file.type, size: file.size };
}
