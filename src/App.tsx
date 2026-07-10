import { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import PhotoStrip from './components/PhotoStrip';
import StartScreen from './components/StartScreen';
import { AppStep, PhotoShot } from './types';

export default function App() {
  const [step, setStep] = useState<AppStep>('start');
  const [photos, setPhotos] = useState<PhotoShot[]>([]);

  const openCamera = () => {
    setPhotos([]);
    setStep('camera');
  };

  const finishCapture = (capturedPhotos: PhotoShot[]) => {
    setPhotos(capturedPhotos);
    setStep('preview');
  };

  if (step === 'camera') {
    return <CameraCapture onComplete={finishCapture} onReset={() => setStep('start')} />;
  }

  if (step === 'preview' && photos.length > 0) {
    return <PhotoStrip photos={photos} onRetake={openCamera} />;
  }

  return <StartScreen onStart={openCamera} />;
}
