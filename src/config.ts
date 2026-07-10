const configuredPhotoCount = Number(import.meta.env.VITE_PHOTO_COUNT ?? 4);

export const PHOTO_COUNT =
  Number.isFinite(configuredPhotoCount) && configuredPhotoCount > 0
    ? configuredPhotoCount
    : 4;
export const COUNTDOWN_FROM = 3;
export const CAPTURE_GAP_MS = 900;

export const WATERMARK_TEXT = 'PHOTOBOX';
