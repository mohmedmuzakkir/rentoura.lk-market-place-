import { PendingUploadImage } from '../types/postFormTypes';

export const MAX_LISTING_IMAGES = 5;
export const MAX_LISTING_IMAGE_BYTES = 5 * 1024 * 1024;
export const LISTING_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export function validateListingImage(file: File): string | null {
  if (!(LISTING_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
    return `${file.name}: use a JPEG, PNG, or WEBP image.`;
  }
  if (file.size > MAX_LISTING_IMAGE_BYTES) {
    return `${file.name}: image must be 5 MB or smaller.`;
  }
  return null;
}

export function createPendingImages(files: File[], existingCount: number): {
  images: PendingUploadImage[];
  errors: string[];
} {
  const errors: string[] = [];
  const available = Math.max(0, MAX_LISTING_IMAGES - existingCount);
  if (files.length > available) errors.push('A listing can have no more than 5 images.');

  const images = files.slice(0, available).flatMap((file, index) => {
    const error = validateListingImage(file);
    if (error) {
      errors.push(error);
      return [];
    }
    return [{
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      isCover: existingCount === 0 && index === 0,
      position: existingCount + index,
    }];
  });
  return { images, errors };
}

export function normalizeImagePositions(images: PendingUploadImage[]): PendingUploadImage[] {
  return images.map((image, position) => ({ ...image, position, isCover: image.isCover || (position === 0 && !images.some(item => item.isCover)) }));
}

export function revokePendingImage(image: PendingUploadImage): void {
  if (image.previewUrl.startsWith('blob:')) URL.revokeObjectURL(image.previewUrl);
}
