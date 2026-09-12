import Image from "next/image";

export default function Hero() {
  return (
    <section className="tile-wall relative -mx-5 overflow-hidden border-y border-salvia-900/10 sm:mx-0 sm:rounded-2xl sm:border">
      <div className="relative flex flex-col items-center px-7 py-16 text-center sm:px-6 sm:py-20 ">
        <Image width={420} height={280} src="/logos/prego-logo.png" alt="" />

        <a
          href="/evento"
          className="group relative z-10 mt-9 inline-flex items-center gap-2 rounded-full bg-salvia-600 px-8 py-3.5 text-sm font-semibold tracking-wide text-durazno-50 shadow-lg shadow-salvia-900/20 transition hover:bg-salvia-700"
        >
          Entradas · Bingo de Plantas
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
