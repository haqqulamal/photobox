export const APP_NAME = 'PICSTOPIA';

const configuredPhotoCount = Number(import.meta.env.VITE_PHOTO_COUNT ?? 4);

export const DEFAULT_PHOTO_COUNT =
  Number.isFinite(configuredPhotoCount) && configuredPhotoCount > 0
    ? Math.min(4, Math.max(1, configuredPhotoCount))
    : 4;
export const PHOTO_COUNT_OPTIONS = [1, 2, 3, 4] as const;
export const COUNTDOWN_FROM = 3;
export const CAPTURE_GAP_MS = 900;

export const WATERMARK_TEXT = APP_NAME;
