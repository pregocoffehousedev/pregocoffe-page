'use client'

import { useEffect, useState } from 'react'
import { LOCAL } from '@/data/local'

type Post = {
  id: string
  caption?: string
  media_url: string
  permalink: string
}

/**
 * Feed de Instagram. Se carga en el cliente para no bloquear el render
 * de la página si la API de Meta está lenta o caída.
 * Si no hay token configurado o falla, la sección no se muestra.
 */
export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[] | null>(null)

  useEffect(() => {
    let vivo = true
    fetch('/api/instagram')
      .then((r) => r.json())
      .then((d) => {
        if (vivo) setPosts(d.posts ?? [])
      })
      .catch(() => {
        if (vivo) setPosts([])
      })
    return () => {
      vivo = false
    }
  }, [])

  // null = cargando · [] = sin token o error → no ocupamos espacio
  if (posts === null || posts.length === 0) return null

  return (
    <section id="instagram" className="scroll-mt-24">
      <header className="text-center">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-salvia-400">
          Día a día
        </p>
        <h2 className="mt-2 text-3xl font-bold text-salvia-800">
          @{LOCAL.instagram}
        </h2>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-xl border border-salvia-100 bg-salvia-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.media_url}
              alt={p.caption?.slice(0, 100) ?? 'Publicación de Instagram'}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-salvia-900/0 transition group-hover:bg-salvia-900/20" />
          </a>
        ))}
      </div>

      <p className="mt-6 text-center">
        <a
          href={`https://instagram.com/${LOCAL.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border border-salvia-200 px-6 py-2.5 text-sm font-medium text-salvia-700 transition hover:bg-salvia-50"
        >
          Seguir en Instagram
        </a>
      </p>
    </section>
  )
}
