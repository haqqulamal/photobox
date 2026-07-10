import { useCallback, useEffect, useRef, useState } from 'react';
import { PhotoShot } from '../types';

type CaptureStatus = 'idle' | 'counting' | 'snapping' | 'complete' | 'error';

type UsePhotoCaptureOptions = {
  photoCount: number;
  countdownFrom: number;
  gapMs: number;
  capturePhoto: () => string | null;
  onComplete: (photos: PhotoShot[]) => void;
};

const wait = (milliseconds: number, timerRef: React.MutableRefObject<number | null>) =>
  new Promise<void>((resolve) => {
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      resolve();
    }, milliseconds);
  });

export const usePhotoCapture = ({
  photoCount,
  countdownFrom,
  gapMs,
  capturePhoto,
  onComplete,
}: UsePhotoCaptureOptions) => {
  const [status, setStatus] = useState<CaptureStatus>('idle');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState<PhotoShot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isActiveRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const stopCapture = useCallback(() => {
    isActiveRef.current = false;

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setCountdown(null);
    setCurrentIndex(0);
    setPhotos([]);
    setStatus('idle');
    setError(null);
  }, []);

  const startCapture = useCallback(async () => {
    if (isActiveRef.current) {
      return;
    }

    isActiveRef.current = true;
    setStatus('counting');
    setPhotos([]);
    setError(null);
    const capturedPhotos: PhotoShot[] = [];

    try {
      for (let index = 0; index < photoCount; index += 1) {
        if (!isActiveRef.current) {
          return;
        }

        setCurrentIndex(index + 1);
        setStatus('counting');

        for (let tick = countdownFrom; tick > 0; tick -= 1) {
          if (!isActiveRef.current) {
            return;
          }

          setCountdown(tick);
          await wait(1000, timerRef);
        }

        setCountdown(null);
        setStatus('snapping');
        await wait(120, timerRef);

        const dataUrl = capturePhoto();

        if (!dataUrl) {
          throw new Error('Foto gagal diambil. Pastikan preview kamera sudah tampil.');
        }

        const photo: PhotoShot = {
          id: crypto.randomUUID(),
          dataUrl,
          capturedAt: new Date().toISOString(),
        };

        capturedPhotos.push(photo);
        setPhotos([...capturedPhotos]);

        if (index < photoCount - 1) {
          await wait(gapMs, timerRef);
        }
      }

      isActiveRef.current = false;
      setStatus('complete');
      setCurrentIndex(photoCount);
      onComplete(capturedPhotos);
    } catch (captureError) {
      isActiveRef.current = false;
      setCountdown(null);
      setStatus('error');
      setError(captureError instanceof Error ? captureError.message : 'Capture gagal.');
    }
  }, [capturePhoto, countdownFrom, gapMs, onComplete, photoCount]);

  useEffect(() => stopCapture, [stopCapture]);

  return {
    countdown,
    currentIndex,
    error,
    photos,
    startCapture,
    status,
    stopCapture,
  };
};
