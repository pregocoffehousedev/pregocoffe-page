export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-salvia-100 bg-white p-10 text-center">
      <p className="text-2xl">🌱</p>
      <h1 className="mt-3 text-xl font-bold text-salvia-800">
        Esta página no existe
      </h1>
      <p className="mt-2 text-sm text-cafe-600">
        Puede que el link esté mal escrito o que la página ya no esté disponible.
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-full bg-salvia-600 px-6 py-2.5 text-sm font-medium text-durazno-50 transition hover:bg-salvia-700"
      >
        Volver al inicio
      </a>
    </div>
  )
}
