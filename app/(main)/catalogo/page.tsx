"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  
  const categories = useQuery(api.movies.getAllCategories);
  const movies = useQuery(api.movies.getByCategory, { category: selectedCategory });

  return (
    <div className="container mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-500">
      <div className="catalog-header bg-[rgba(249,183,255,0.05)] p-8 rounded-[30px] border-2 border-accent1 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--accent-1)_0%,transparent_60%)] opacity-10" />
        <h1 className="font-mono text-4xl md:text-5xl font-black text-accent1 tracking-tighter uppercase relative z-10">
          Explorar <span className="text-white">Catálogo</span>
        </h1>
        <p className="text-textSecondary mt-2 font-medium relative z-10">
          Filtra por género y descubre nuevas realidades rectangulares.
        </p>
      </div>

      <div className="genre-filters flex flex-wrap gap-3 p-6 bg-[rgba(249,183,255,0.03)] rounded-[40px] border border-[rgba(249,183,255,0.15)] backdrop-blur-md">
        {categories === undefined ? (
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-white/5 animate-pulse rounded-full" />
            ))}
          </div>
        ) : (
          categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 border-2",
                selectedCategory === cat
                  ? "bg-accent1 text-bgPrimary border-accent1 shadow-[0_0_20px_rgba(249,183,255,0.4)] scale-105"
                  : "bg-transparent text-textSecondary border-[rgba(249,183,255,0.2)] hover:border-accent1 hover:text-accent1"
              )}
            >
              {cat}
            </button>
          ))
        )}
      </div>

      <div className="results-info flex items-center justify-between px-6 py-4 bg-[rgba(249,183,255,0.05)] rounded-2xl border-l-4 border-accent1">
        <span className="font-mono text-sm font-bold text-white uppercase tracking-widest">
          Resultados: <span className="text-accent1 ml-2">{movies?.length || 0}</span>
        </span>
        <div className="flex gap-4 text-[10px] font-black uppercase text-accent2">
          <span className="cursor-pointer hover:text-accent1 underline underline-offset-4">Grid View</span>
          <span className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity">List View</span>
        </div>
      </div>

      {movies === undefined ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-accent1" />
          <p className="font-mono text-xs text-accent2 animate-pulse uppercase">Sincronizando base de datos...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 bg-[rgba(249,183,255,0.02)] rounded-[30px] border-2 border-dashed border-[rgba(249,183,255,0.1)]">
          <Search className="mx-auto h-16 w-16 text-accent1/20 mb-4" />
          <h3 className="font-mono text-xl font-bold text-white uppercase">Sin coincidencias</h3>
          <p className="text-textSecondary mt-2">Nuestra librería se actualiza constantemente. Prueba con otro género.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {movies.map((movie) => (
            <Link href={`/watch/${movie._id}`} key={movie._id} className="group">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-[rgba(249,183,255,0.15)] bg-[rgba(249,183,255,0.03)] transition-all duration-500 group-hover:-translate-y-3 group-hover:border-accent1 group-hover:shadow-[0_20px_40px_rgba(249,183,255,0.25)]">
                <img 
                  src={movie.thumbnail} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button className="w-full h-8 bg-accent1 text-bgPrimary text-[10px] font-black rounded-lg">
                    VER AHORA
                  </Button>
                </div>
              </div>
              <div className="mt-4 px-1">
                <h3 className="font-sans text-xs font-bold text-white group-hover:text-accent1 transition-colors uppercase truncate">
                  {movie.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                   <p className="font-mono text-[9px] text-accent2 font-bold uppercase tracking-widest">
                    {movie.category}
                  </p>
                  <span className="text-[9px] text-textSecondary font-bold">4K HDR</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-10">
        <div className="flex items-center gap-4 bg-[rgba(249,183,255,0.05)] p-2 px-6 rounded-full border border-[rgba(249,183,255,0.1)]">
          <span className="text-accent1 font-bold cursor-pointer opacity-40">ANTERIOR</span>
          <span className="w-8 h-8 flex items-center justify-center bg-accent1 text-bgPrimary rounded-full font-black text-xs">1</span>
          <span className="text-white font-bold cursor-pointer hover:text-accent1 transition-colors text-xs">2</span>
          <span className="text-white font-bold cursor-pointer hover:text-accent1 transition-colors text-xs">3</span>
          <span className="text-accent1 font-bold cursor-pointer">SIGUIENTE</span>
        </div>
      </div>
    </div>
  );
}