import { validateListingImage } from './pendingUploadImages';

export interface ProcessedListingImage {
  file: File;
  width: number;
  height: number;
  mimeType: string;
  size: number;
}

const MAX_DIMENSION = 2560;

async function loadBrandLogoBitmap(): Promise<ImageBitmap | null> {
  try {
    if (typeof window === 'undefined') return null;
    const resp = await fetch('/brand/rentoura-official-icon-512.png');
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return await createImageBitmap(blob);
  } catch {
    return null;
  }
}

function drawFallbackLogoR(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx, cy);
  const scale = size / 100;
  ctx.scale(scale, scale);

  // Speed lines
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;

  // Top speed bar
  ctx.beginPath();
  ctx.roundRect(-42, -28, 20, 6, 3);
  ctx.fill();
  ctx.stroke();

  // Middle speed bar
  ctx.beginPath();
  ctx.roundRect(-48, -8, 24, 6, 3);
  ctx.fill();
  ctx.stroke();

  // Bottom speed bar
  ctx.beginPath();
  ctx.roundRect(-44, 12, 20, 6, 3);
  ctx.fill();
  ctx.stroke();

  // Bold 'R' logo letter
  ctx.font = '900 68px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.fillStyle = '#ffffff';
  ctx.strokeText('R', 6, 0);
  ctx.fillText('R', 6, 0);

  ctx.restore();
}

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

  // Centered Watermark with Logo Mark + RENTOURA.LK Text
  const minDim = Math.min(width, height);
  const logoSize = Math.max(64, Math.min(340, Math.round(minDim * 0.24)));
  const fontSize = Math.max(18, Math.min(76, Math.round(logoSize * 0.38)));
  const gap = Math.max(6, Math.round(fontSize * 0.25));

  const centerX = width / 2;
  const centerY = height / 2;
  const totalWatermarkHeight = logoSize + gap + fontSize;
  const startY = centerY - (totalWatermarkHeight / 2);

  context.save();
  context.globalAlpha = 0.65; // Semi-transparent central watermark matching reference image

  const logoBitmap = await loadBrandLogoBitmap();
  if (logoBitmap) {
    const logoX = centerX - (logoSize / 2);
    const logoY = startY;
    context.drawImage(logoBitmap, logoX, logoY, logoSize, logoSize);
    if ('close' in logoBitmap && typeof (logoBitmap as any).close === 'function') {
      (logoBitmap as any).close();
    }
  } else {
    drawFallbackLogoR(context, centerX, startY + (logoSize / 2), logoSize * 0.85);
  }

  // Draw 'RENTOURA.LK' text centered directly beneath logo mark
  const textY = startY + logoSize + gap;
  context.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.lineWidth = Math.max(2, fontSize * 0.08);
  context.strokeStyle = 'rgba(0, 0, 0, 0.55)';
  context.fillStyle = '#ffffff';

  context.strokeText('RENTOURA.LK', centerX, textY);
  context.fillText('RENTOURA.LK', centerX, textY);

  context.restore();

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
    result => result ? resolve(result) : reject(new Error('Image processing failed.')),
    'image/webp',
    0.88,
  ));
  const file = new File([blob], `${crypto.randomUUID()}.webp`, { type: 'image/webp' });
  return { file, width, height, mimeType: file.type, size: file.size };
}
