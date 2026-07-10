type CountdownTimerProps = {
  value: number | null;
  isSnapping: boolean;
};

export default function CountdownTimer({ value, isSnapping }: CountdownTimerProps) {
  if (value === null && !isSnapping) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
      {value !== null && (
        <div key={value} className="countdown-number animate-pop">
          {value}
        </div>
      )}
      {isSnapping && <div className="absolute inset-0 animate-snap bg-white" />}
    </div>
  );
}
