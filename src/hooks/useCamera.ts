import { useCallback, useState } from 'react';

export const useCamera = () => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const handleUserMedia = useCallback(() => {
    setHasPermission(true);
    setCameraError(null);
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    setHasPermission(false);
    const errorName = typeof error === 'string' ? error : error.name;

    if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
      setCameraError('Akses kamera ditolak. Izinkan kamera di browser lalu coba lagi.');
      return;
    }

    if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
      setCameraError('Kamera tidak ditemukan di perangkat ini.');
      return;
    }

    setCameraError('Kamera belum bisa dibuka. Cek izin browser atau perangkat kamera.');
  }, []);

  const resetCameraError = useCallback(() => {
    setCameraError(null);
    setHasPermission(null);
  }, []);

  return {
    cameraError,
    hasPermission,
    handleUserMedia,
    handleUserMediaError,
    resetCameraError,
  };
};
