import { FrameVariant } from '../types';

type FrameSelectorProps = {
  frames: FrameVariant[];
  selectedFrame: FrameVariant;
  onSelectFrame: (frame: FrameVariant) => void;
};

export default function FrameSelector({
  frames,
  selectedFrame,
  onSelectFrame,
}: FrameSelectorProps) {
  const getSwatchBackground = (frame: FrameVariant) => {
    if (frame.overlayImageUrl) {
      return `url(${frame.overlayImageUrl}) center / cover, ${frame.background}`;
    }

    if (frame.pattern === 'checker') {
      return `conic-gradient(${frame.secondary} 25%, ${frame.background} 0 50%, ${frame.secondary} 0 75%, ${frame.background} 0)`;
    }

    if (frame.pattern === 'dots') {
      return `radial-gradient(circle, ${frame.secondary} 28%, transparent 30%), ${frame.background}`;
    }

    if (frame.pattern === 'diagonal') {
      return `repeating-linear-gradient(135deg, ${frame.background} 0 12px, ${frame.secondary} 12px 24px)`;
    }

    if (frame.pattern === 'ticket') {
      return `linear-gradient(90deg, ${frame.secondary} 0 24%, ${frame.background} 24% 76%, ${frame.secondary} 76%)`;
    }

    if (frame.pattern === 'stripes') {
      return `repeating-linear-gradient(0deg, ${frame.background} 0 14px, ${frame.secondary} 14px 28px)`;
    }

    return frame.background;
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {frames.map((frame) => {
        const isSelected = frame.id === selectedFrame.id;

        return (
          <button
            aria-pressed={isSelected}
            className={`frame-option ${isSelected ? 'translate-x-1 translate-y-1 shadow-none' : ''}`}
            key={frame.id}
            onClick={() => onSelectFrame(frame)}
            style={{ backgroundColor: frame.background, color: frame.textColor }}
            type="button"
          >
            <span
              className="h-10 w-10 border-4 border-ink"
              style={{
                background: getSwatchBackground(frame),
                backgroundSize:
                  frame.pattern === 'checker' && !frame.overlayImageUrl ? '18px 18px' : undefined,
              }}
            />
            <span>{frame.name}</span>
          </button>
        );
      })}
    </div>
  );
}
