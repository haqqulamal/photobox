import { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import PhotoStrip from './components/PhotoStrip';
import StartScreen from './components/StartScreen';
import { DEFAULT_PHOTO_COUNT } from './config';
import { AppStep, PhotoCount, PhotoShot } from './types';

export default function App() {
  const [step, setStep] = useState<AppStep>('start');
  const [photos, setPhotos] = useState<PhotoShot[]>([]);
  const [photoCount, setPhotoCount] = useState<PhotoCount>(DEFAULT_PHOTO_COUNT as PhotoCount);

  const openCamera = () => {
    setPhotos([]);
    setStep('camera');
  };

  const finishCapture = (capturedPhotos: PhotoShot[]) => {
    setPhotos(capturedPhotos);
    setStep('preview');
  };

  if (step === 'camera') {
    return (
      <CameraCapture
        onComplete={finishCapture}
        onReset={() => setStep('start')}
        photoCount={photoCount}
      />
    );
  }

  if (step === 'preview' && photos.length > 0) {
    return <PhotoStrip photos={photos} onRetake={openCamera} />;
  }

  return (
    <StartScreen
      onPhotoCountChange={setPhotoCount}
      onStart={openCamera}
      photoCount={photoCount}
    />
  );
}
