import { RotateCcw, Play, SwitchCamera, X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import CountdownTimer from './CountdownTimer';
import { CAPTURE_GAP_MS, COUNTDOWN_FROM } from '../config';
import { useCamera } from '../hooks/useCamera';
import { usePhotoCapture } from '../hooks/usePhotoCapture';
import { PhotoCount, PhotoShot } from '../types';

type CameraCaptureProps = {
  photoCount: PhotoCount;
  onComplete: (photos: PhotoShot[]) => void;
  onReset: () => void;
};

export default function CameraCapture({
  photoCount,
  onComplete,
  onReset,
}: CameraCaptureProps) {
  const webcamRef = useRef<Webcam | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const { cameraError, handleUserMedia, handleUserMediaError, resetCameraError } = useCamera();
  const videoConstraints = useMemo<MediaTrackConstraints>(
    () => ({
      facingMode,
      width: { ideal: 1280 },
      height: { ideal: 960 },
    }),
    [facingMode],
  );

  const capturePhoto = useCallback(() => {
    return (
      webcamRef.current?.getScreenshot({
        width: 1280,
        height: 960,
      }) ?? null
    );
  }, []);

  const {
    countdown,
    currentIndex,
    error,
    photos,
    startCapture,
    status,
    stopCapture,
  } = usePhotoCapture({
    capturePhoto,
    countdownFrom: COUNTDOWN_FROM,
    gapMs: CAPTURE_GAP_MS,
    onComplete,
    photoCount,
  });

  const resetCapture = () => {
    stopCapture();
    resetCameraError();
  };

  const switchFacingMode = () => {
    stopCapture();
    setFacingMode((currentFacingMode) =>
      currentFacingMode === 'user' ? 'environment' : 'user',
    );
    resetCameraError();
  };

  return (
    <main className="min-h-screen bg-paper px-4 py-5 sm:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="brutal-badge mb-3 inline-flex bg-acid">
              FOTO {Math.min(Math.max(currentIndex, photos.length + 1), photoCount)}/{photoCount}
            </p>
            <h1 className="font-display text-5xl font-black uppercase leading-none sm:text-7xl">
              POSE NOW.
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="brutal-button bg-sun"
              disabled={status === 'counting' || status === 'snapping'}
              onClick={startCapture}
            >
              <Play size={26} strokeWidth={3} />
              SNAP
            </button>
            <button className="brutal-button bg-white" onClick={resetCapture}>
              <RotateCcw size={26} strokeWidth={3} />
              RESET
            </button>
            <button
              aria-label="Ganti kamera depan atau belakang"
              className="brutal-icon-button bg-acid"
              onClick={switchFacingMode}
            >
              <SwitchCamera size={28} strokeWidth={3} />
            </button>
            <button className="brutal-icon-button bg-punch text-white" onClick={onReset} aria-label="Kembali">
              <X size={28} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="camera-frame relative overflow-hidden bg-ink">
            <Webcam
              audio={false}
              className="h-full min-h-[420px] w-full object-cover"
              mirrored
              key={facingMode}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              ref={webcamRef}
              screenshotFormat="image/png"
              screenshotQuality={1}
              videoConstraints={videoConstraints}
            />
            <CountdownTimer value={countdown} isSnapping={status === 'snapping'} />
            {cameraError && (
              <div className="absolute inset-4 z-30 grid place-items-center border-4 border-ink bg-sun p-5 text-center shadow-brutal">
                <div>
                  <p className="font-display text-4xl font-black uppercase">Kamera Error</p>
                  <p className="mt-3 text-xl font-black">{cameraError}</p>
                </div>
              </div>
            )}
          </div>

          <aside className="grid content-start gap-4">
            {Array.from({ length: photoCount }, (_, index) => {
              const photo = photos[index];
              const isActive = currentIndex === index + 1 && status !== 'idle';

              return (
                <div
                  className={`thumb-slot ${isActive ? 'bg-acid' : 'bg-white'}`}
                  key={index}
                >
                  {photo ? (
                    <img alt={`Foto ${index + 1}`} className="h-full w-full object-cover" src={photo.dataUrl} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              );
            })}
          </aside>
        </div>

        {error && <div className="error-panel">{error}</div>}
      </section>
    </main>
  );
}
