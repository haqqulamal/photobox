import { Camera } from 'lucide-react';

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="screen-grid min-h-screen px-5 py-8 sm:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="-rotate-1">
          <p className="brutal-badge mb-5 inline-flex bg-acid">4 SHOTS / 1 STRIP</p>
          <h1 className="max-w-4xl font-display text-[clamp(4rem,14vw,11rem)] font-black uppercase leading-[0.78] tracking-normal text-ink">
            SNAP <span className="text-punch text-stroke">IT.</span>
          </h1>
          <p className="mt-7 max-w-2xl border-4 border-ink bg-white p-4 text-xl font-black leading-tight shadow-brutal sm:text-2xl">
            Masuk, pose, hitung mundur, dan bawa pulang strip PNG langsung dari
            browser.
          </p>
          <button className="brutal-button mt-8 bg-sun text-2xl sm:text-3xl" onClick={onStart}>
            <Camera size={32} strokeWidth={3} />
            MULAI FOTO
          </button>
        </div>

        <div className="rotate-1 border-4 border-ink bg-electric p-4 shadow-brutal-lg">
          <div className="grid gap-4">
            {['COUNTDOWN 3-2-1', 'AUTO SNAP 4X', 'DOWNLOAD PNG'].map((label, index) => (
              <div
                className="flex items-center justify-between border-4 border-ink bg-white p-4 font-display text-2xl font-black"
                key={label}
              >
                <span>{label}</span>
                <span className="grid h-12 w-12 place-items-center border-4 border-ink bg-acid">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
