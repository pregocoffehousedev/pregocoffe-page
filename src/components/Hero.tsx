import Image from "next/image";
import { obtenerBingoVigente } from "@/lib/bingoVigente";

export default async function Hero() {
  const bingoVigente = await obtenerBingoVigente();

  return (
    <section className="tile-wall relative -mx-5 overflow-hidden border-y border-salvia-900/10 sm:mx-0 sm:rounded-2xl sm:border">
      <div className="relative flex flex-col items-center px-7 py-16 text-center sm:px-6 sm:py-20 ">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.6),rgba(255,255,255,0.3)_55%,transparent_100%)] sm:-top-10 sm:h-[680px] sm:w-[680px]"
        />
        <Image
          width={500}
          height={333}
          src="/logos/prego-logo.png"
          alt="Prego Coffee House"
          className="relative h-auto w-[260px] sm:w-[340px]"
        />

        <a
          href={bingoVigente ? "/evento" : "/#carta"}
          className="group relative z-10 mt-9 inline-flex items-center gap-2 rounded-full bg-salvia-600 px-8 py-3.5 text-sm font-semibold tracking-wide text-durazno-50 shadow-lg shadow-salvia-900/20 transition hover:bg-salvia-700"
        >
          {bingoVigente ? "Entradas · Bingo de Plantas" : "Ven a probar algo rico"}
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
