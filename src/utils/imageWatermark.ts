import { validateListingImage } from './pendingUploadImages';

export interface ProcessedListingImage {
  file: File;
  width: number;
  height: number;
  mimeType: string;
  size: number;
}

export type WatermarkModule = 'rental' | 'job' | 'service' | 'rentals' | 'jobs' | 'services';

/**
 * Processes listing images by resizing and applying a clean, semi-transparent
 * centered "RENTOURA.LK" text watermark directly onto the photo.
 */
export async function applyRentouraWatermark(
  source: File,
  _module?: WatermarkModule,
  _categoryId?: string
): Promise<ProcessedListingImage> {
  const validationError = validateListingImage(source);
  if (validationError) throw new Error(validationError);

  const bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' });

  // Max dimension 1600px for optimal resolution and fast loading
  const maxDim = 1600;
  let targetWidth = bitmap.width;
  let targetHeight = bitmap.height;

  if (targetWidth > maxDim || targetHeight > maxDim) {
    if (targetWidth > targetHeight) {
      targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
      targetWidth = maxDim;
    } else {
      targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
      targetHeight = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot process listing images.');

  // 1. Draw photo scaled to exact target dimensions (no extra padding or margins)
  context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  // 2. Render simple centered "RENTOURA.LK" text watermark directly on the photo
  const fontSize = Math.max(24, Math.round(targetWidth * 0.052));
  context.save();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

  const centerX = targetWidth / 2;
  const centerY = targetHeight / 2;

  // Dark subtle outline to ensure legibility on bright backgrounds
  context.strokeStyle = 'rgba(15, 23, 42, 0.35)';
  context.lineWidth = Math.max(2, Math.round(fontSize * 0.04));
  context.strokeText('RENTOURA.LK', centerX, centerY);

  // Semi-transparent white fill
  context.fillStyle = 'rgba(255, 255, 255, 0.45)';
  context.fillText('RENTOURA.LK', centerX, centerY);

  context.restore();

  // 3. Compress cleanly to WebP (Quality 0.88)
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
    result => result ? resolve(result) : reject(new Error('Image processing failed.')),
    'image/webp',
    0.88,
  ));

  const file = new File([blob], `${crypto.randomUUID()}.webp`, { type: 'image/webp' });
  return {
    file,
    width: targetWidth,
    height: targetHeight,
    mimeType: file.type,
    size: file.size
  };
}

export const processListingImage = applyRentouraWatermark;
