"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Loader2, Play, Info } from "lucide-react";
import { useMemo } from "react";

export default function HomePage() {
  const movies = useQuery(api.movies.getByCategory, { category: "Todas" });

  const featuredMovie = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    return movies[Math.floor(Math.random() * movies.length)];
  }, [movies]);

  if (movies === undefined) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent1" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {featuredMovie && (
        <section className="relative overflow-hidden rounded-[30px] border-2 border-accent1 p-8 md:p-16 bg-[linear-gradient(135deg,rgba(249,183,255,0.1),rgba(249,183,255,0.05))] shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
          <div 
            className="absolute inset-0 opacity-20 blur-xl scale-110"
            style={{ 
              backgroundImage: `url(${featuredMovie.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,var(--accent-1)_0%,transparent_50%)] opacity-10 animate-[spin_20s_linear_infinite] pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-3xl">
            <span className="bg-accent1/20 text-accent1 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-accent1/30">
              Recomendación Trailix
            </span>
            <h1 className="font-mono text-4xl md:text-7xl font-black text-accent1 leading-tight drop-shadow-[0_0_20px_rgba(249,183,255,0.6)] uppercase tracking-tighter">
              {featuredMovie.title}
            </h1>
            <p className="text-lg md:text-xl text-white font-medium max-w-xl leading-relaxed line-clamp-3">
              {featuredMovie.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={`/watch/${featuredMovie._id}`}>
                <button className="flex items-center gap-2 bg-accent1 text-bgPrimary px-8 py-4 rounded-full font-bold hover:translate-y-[-5px] hover:shadow-[0_15px_40px_rgba(249,183,255,0.4)] transition-all duration-300 uppercase tracking-widest text-sm">
                  <Play className="fill-current w-5 h-5" /> Reproducir Ahora
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-8">
        <div className="flex justify-between items-center bg-[rgba(249,183,255,0.08)] p-5 px-10 rounded-full border border-[rgba(249,183,255,0.2)] backdrop-blur-md">
          <h2 className="font-mono text-xl md:text-2xl font-black text-accent1 tracking-widest uppercase">
            POPULARES EN TRAILIX
          </h2>
          <Link href="/catalogo" className="text-accent2 font-bold hover:text-accent1 transition-colors text-sm uppercase tracking-widest flex items-center gap-2">
            Ver Todo <span className="text-lg">›</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-2">
          {movies.map((movie) => (
            <Link href={`/watch/${movie._id}`} key={movie._id} className="group">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-[rgba(249,183,255,0.15)] bg-[rgba(249,183,255,0.03)] backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-3 group-hover:border-accent1 group-hover:shadow-[0_20px_40px_rgba(249,183,255,0.25)]">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 right-3 bg-accent3 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg">
                  4K HDR
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="font-sans text-sm font-bold text-white group-hover:text-accent1 transition-colors uppercase truncate">
                  {movie.title}
                </h3>
                <p className="font-mono text-[10px] text-accent2 font-bold uppercase tracking-widest">
                  {movie.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}