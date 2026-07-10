import { FrameVariant, PhotoShot, PhotoStripOptions } from '../types';
import { WATERMARK_TEXT } from '../config';

export const FRAME_VARIANTS: FrameVariant[] = [
  {
    id: 'comic-pop',
    name: 'COMIC POP',
    pattern: 'dots',
    background: '#ffd62e',
    border: '#050505',
    accent: '#ff3ea5',
    secondary: '#2f6bff',
    textColor: '#050505',
  },
  {
    id: 'checker-clash',
    name: 'CHECKER',
    pattern: 'checker',
    background: '#ffffff',
    border: '#050505',
    accent: '#c8ff2e',
    secondary: '#ff3ea5',
    textColor: '#050505',
  },
  {
    id: 'electric-tape',
    name: 'TAPE BLUE',
    pattern: 'diagonal',
    background: '#2f6bff',
    border: '#050505',
    accent: '#c8ff2e',
    secondary: '#ffffff',
    textColor: '#050505',
  },
  {
    id: 'ticket-pink',
    name: 'TICKET',
    pattern: 'ticket',
    background: '#ff3ea5',
    border: '#050505',
    accent: '#ffd62e',
    secondary: '#ffffff',
    textColor: '#050505',
  },
  {
    id: 'arcade-lime',
    name: 'ARCADE',
    pattern: 'stripes',
    background: '#c8ff2e',
    border: '#050505',
    accent: '#ff3ea5',
    secondary: '#2f6bff',
    textColor: '#050505',
  },
  {
    id: 'classic-booth',
    name: 'CLASSIC',
    pattern: 'solid',
    background: '#fffaf0',
    border: '#050505',
    accent: '#ffffff',
    secondary: '#ffd62e',
    textColor: '#050505',
  },
];

export const DEFAULT_STRIP_OPTIONS: Omit<PhotoStripOptions, 'frame'> = {
  width: 760,
  photoWidth: 640,
  photoHeight: 480,
  padding: 44,
  gap: 24,
  footerHeight: 120,
  watermarkEnabled: true,
};

const loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Gagal memuat salah satu foto.'));
    image.src = source;
  });

const drawCoverImage = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  targetWidth: number,
  targetHeight: number,
) => {
  const imageRatio = image.width / image.height;
  const targetRatio = targetWidth / targetHeight;

  const sourceWidth = imageRatio > targetRatio ? image.height * targetRatio : image.width;
  const sourceHeight = imageRatio > targetRatio ? image.height : image.width / targetRatio;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = (image.height - sourceHeight) / 2;

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    targetWidth,
    targetHeight,
  );
};

const drawDiagonalStripes = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
) => {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 22;

  for (let x = -height; x < width + height; x += 56) {
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(x + height, 0);
    context.stroke();
  }

  context.restore();
};

const drawCheckerPattern = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
) => {
  const tileSize = 52;
  context.fillStyle = color;

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      if ((x / tileSize + y / tileSize) % 2 === 0) {
        context.fillRect(x, y, tileSize, tileSize);
      }
    }
  }
};

const drawDotPattern = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
) => {
  context.fillStyle = color;

  for (let y = 36; y < height; y += 62) {
    for (let x = 36; x < width; x += 62) {
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2);
      context.fill();
    }
  }
};

const drawTicketPattern = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: FrameVariant,
) => {
  context.fillStyle = frame.secondary;
  context.fillRect(0, 0, 34, height);
  context.fillRect(width - 34, 0, 34, height);

  context.fillStyle = frame.background;
  for (let y = 32; y < height; y += 58) {
    context.beginPath();
    context.arc(34, y, 14, 0, Math.PI * 2);
    context.arc(width - 34, y, 14, 0, Math.PI * 2);
    context.fill();
  }
};

const drawFrameBackground = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: FrameVariant,
) => {
  if (frame.overlayImageUrl) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    return;
  }

  context.fillStyle = frame.background;
  context.fillRect(0, 0, width, height);

  if (frame.pattern === 'checker') {
    drawCheckerPattern(context, width, height, frame.secondary);
  }

  if (frame.pattern === 'dots') {
    drawDotPattern(context, width, height, frame.secondary);
  }

  if (frame.pattern === 'diagonal') {
    drawDiagonalStripes(context, width, height, frame.secondary);
  }

  if (frame.pattern === 'ticket') {
    drawTicketPattern(context, width, height, frame);
  }

  if (frame.pattern === 'stripes') {
    context.fillStyle = frame.secondary;
    for (let y = 0; y < height; y += 76) {
      context.fillRect(0, y, width, 30);
    }
  }
};

export const getStripHeight = (photoCount: number, options: PhotoStripOptions) =>
  options.padding * 2 +
  options.footerHeight +
  photoCount * options.photoHeight +
  Math.max(0, photoCount - 1) * options.gap;

export const drawPhotoStrip = async (
  canvas: HTMLCanvasElement,
  photos: PhotoShot[],
  options: PhotoStripOptions,
) => {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas tidak didukung di browser ini.');
  }

  const stripHeight = getStripHeight(photos.length, options);
  canvas.width = options.width;
  canvas.height = stripHeight;

  drawFrameBackground(context, options.width, stripHeight, options.frame);

  context.lineWidth = 10;
  context.strokeStyle = options.frame.border;
  context.strokeRect(5, 5, options.width - 10, stripHeight - 10);

  const loadedImages = await Promise.all(photos.map((photo) => loadImage(photo.dataUrl)));
  const photoX = (options.width - options.photoWidth) / 2;

  loadedImages.forEach((image, index) => {
    const photoY = options.padding + index * (options.photoHeight + options.gap);

    context.save();
    context.fillStyle = '#ffffff';
    context.fillRect(photoX - 10, photoY - 10, options.photoWidth + 20, options.photoHeight + 20);
    context.lineWidth = 8;
    context.strokeStyle = options.frame.border;
    context.strokeRect(photoX - 10, photoY - 10, options.photoWidth + 20, options.photoHeight + 20);
    drawCoverImage(context, image, photoX, photoY, options.photoWidth, options.photoHeight);
    context.restore();

    context.fillStyle = options.frame.accent;
    context.fillRect(photoX + options.photoWidth - 72, photoY + 18, 42, 42);
    context.lineWidth = 5;
    context.strokeStyle = options.frame.border;
    context.strokeRect(photoX + options.photoWidth - 72, photoY + 18, 42, 42);

    if (options.frame.pattern === 'diagonal' || options.frame.pattern === 'stripes') {
      context.save();
      context.translate(photoX + 34, photoY - 18);
      context.rotate(-0.12);
      context.fillStyle = options.frame.accent;
      context.fillRect(0, 0, 128, 34);
      context.lineWidth = 5;
      context.strokeStyle = options.frame.border;
      context.strokeRect(0, 0, 128, 34);
      context.restore();
    }
  });

  const footerY = stripHeight - options.footerHeight;
  context.fillStyle = options.frame.accent;
  context.fillRect(options.padding, footerY + 24, options.width - options.padding * 2, 58);
  context.lineWidth = 6;
  context.strokeStyle = options.frame.border;
  context.strokeRect(options.padding, footerY + 24, options.width - options.padding * 2, 58);

  if (options.watermarkEnabled) {
    context.fillStyle = options.frame.textColor;
    context.font = '900 34px Poppins, Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(WATERMARK_TEXT, options.width / 2, footerY + 53);
  }

  context.fillStyle = options.frame.textColor;
  context.font = '700 18px Poppins, Arial, sans-serif';
  context.textAlign = 'center';
  context.fillText(new Date().toLocaleDateString(), options.width / 2, footerY + 100);

  if (options.frame.overlayImageUrl) {
    const overlayImage = await loadImage(options.frame.overlayImageUrl);
    context.drawImage(overlayImage, 0, 0, options.width, stripHeight);
  }
};

export const canvasToPngBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Gagal membuat file PNG.'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
