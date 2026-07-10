export type AppStep = 'start' | 'camera' | 'preview';

export type PhotoCount = 1 | 2 | 3 | 4;

export type PhotoShot = {
  id: string;
  dataUrl: string;
  capturedAt: string;
};

export type FramePattern =
  | 'solid'
  | 'checker'
  | 'dots'
  | 'diagonal'
  | 'ticket'
  | 'stripes';

export type FrameVariant = {
  id: string;
  name: string;
  pattern: FramePattern;
  background: string;
  border: string;
  accent: string;
  secondary: string;
  textColor: string;
};

export type PhotoStripOptions = {
  width: number;
  photoWidth: number;
  photoHeight: number;
  padding: number;
  gap: number;
  footerHeight: number;
  frame: FrameVariant;
  watermarkEnabled: boolean;
};
