import { Download, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import FrameSelector from './FrameSelector';
import { FRAME_VARIANTS, DEFAULT_STRIP_OPTIONS, canvasToPngBlob, drawPhotoStrip } from '../utils/canvasHelpers';
import { FrameVariant, PhotoShot } from '../types';

type PhotoStripProps = {
  photos: PhotoShot[];
  onRetake: () => void;
};

export default function PhotoStrip({ photos, onRetake }: PhotoStripProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameVariant>(FRAME_VARIANTS[0]);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const stripOptions = useMemo(
    () => ({
      ...DEFAULT_STRIP_OPTIONS,
      frame: selectedFrame,
      watermarkEnabled,
    }),
    [selectedFrame, watermarkEnabled],
  );

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    drawPhotoStrip(canvas, photos, stripOptions).catch((error: unknown) => {
      setRenderError(error instanceof Error ? error.message : 'Gagal membuat strip.');
    });
  }, [photos, stripOptions]);

  const downloadStrip = async () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const blob = await canvasToPngBlob(canvas);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `photobox-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-paper px-5 py-6 sm:px-8">
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,0.84fr)_minmax(320px,0.56fr)]">
        <div className="order-2 flex justify-center lg:order-1">
          <div className="strip-shell bg-white">
            <canvas
              aria-label="Hasil strip foto"
              className="h-auto w-full max-w-[360px] border-4 border-ink bg-white sm:max-w-[420px]"
              ref={canvasRef}
            />
          </div>
        </div>

        <aside className="order-1 flex flex-col gap-5 lg:order-2">
          <div className="border-4 border-ink bg-sun p-5 shadow-brutal">
            <p className="brutal-badge mb-3 inline-flex bg-white">HASIL STRIP</p>
            <h2 className="font-display text-5xl font-black uppercase leading-none sm:text-6xl">
              PILIH FRAME.
            </h2>
          </div>

          <div className="border-4 border-ink bg-white p-4 shadow-brutal">
            <FrameSelector
              frames={FRAME_VARIANTS}
              onSelectFrame={setSelectedFrame}
              selectedFrame={selectedFrame}
            />
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 border-4 border-ink bg-acid p-4 text-lg font-black shadow-brutal-sm">
            <span>WATERMARK</span>
            <input
              checked={watermarkEnabled}
              className="h-7 w-7 accent-black"
              onChange={(event) => setWatermarkEnabled(event.target.checked)}
              type="checkbox"
            />
          </label>

          {renderError && <div className="error-panel">{renderError}</div>}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <button className="brutal-button bg-punch text-white" onClick={downloadStrip}>
              <Download size={26} strokeWidth={3} />
              DOWNLOAD
            </button>
            <button className="brutal-button bg-white" onClick={onRetake}>
              <RotateCcw size={26} strokeWidth={3} />
              ULANGI
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
