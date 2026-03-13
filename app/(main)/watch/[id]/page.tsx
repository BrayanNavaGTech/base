"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Play, Heart, Share2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function WatchPage() {
  const { id } = useParams();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  
  const movie = useQuery(api.movies.getById, { id: id as any });
  const user = useQuery(api.users.getUserByEmail, { email: email ?? "" });
  const allMovies = useQuery(api.movies.getByCategory, { category: "Todas" });

  const isFav = useQuery(api.favorites.isFavorite, 
    user?._id && movie?._id ? { userId: user._id, movieId: movie._id } : "skip"
  );
  const toggleFav = useMutation(api.favorites.toggleFavorite);

  const [adTimer, setAdTimer] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [canWatch, setCanWatch] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    if (!storedEmail) {
      router.push("/login");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      if (user.plan === "free") {
        setAdTimer(30);
        setShowAd(true);
      } else if (user.plan === "basic") {
        setAdTimer(5);
        setShowAd(true);
      } else {
        setCanWatch(true);
      }
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAd && adTimer > 0) {
      interval = setInterval(() => setAdTimer((prev) => prev - 1), 1000);
    } else if (adTimer === 0 && showAd) {
      setShowAd(false);
      setCanWatch(true);
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);

  const relatedMovies = useMemo(() => {
    if (!allMovies || !movie) return [];
    return allMovies
      .filter((m) => m.category === movie.category && m._id !== movie._id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
  }, [allMovies, movie]);

  const handleFavorite = async () => {
    if (user && movie) {
      await toggleFav({ userId: user._id, movieId: movie._id });
    }
  };

  const getEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`;
  };

  if (movie === undefined || user === undefined) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent1 h-12 w-12" />
      </div>
    );
  }

  if (movie === null) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-foreground font-sans">
        <h2 className="text-2xl font-bold uppercase font-mono text-accent1">Contenido no disponible</h2>
        <button onClick={() => router.push("/")} className="mt-4 text-accent2 underline uppercase text-xs font-bold tracking-widest">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-6 font-mono text-[10px] font-black tracking-widest text-textSecondary uppercase">
        <Link href="/" className="hover:text-accent1 transition-colors">Inicio</Link>
        <ChevronRight className="w-3 h-3 text-accent1" />
        <Link href="/catalogo" className="hover:text-accent1 transition-colors">Catálogo</Link>
        <ChevronRight className="w-3 h-3 text-accent1" />
        <span className="text-accent1">{movie.title}</span>
      </div>

      <div className="relative aspect-video w-full bg-black rounded-[30px] overflow-hidden border-2 border-accent1 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {canWatch ? (
          <iframe src={getEmbedUrl(movie.youtubeUrl)} className="w-full h-full" allowFullScreen />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bgPrimary/95 z-40 p-6">
            {showAd ? (
              <div className="space-y-6">
                <div className="text-accent1 font-mono text-6x1 md:text-8x1 font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(249,183,255,0.6)]">ANUNCIO</div>
                <p className="text-xl md:text-2x1 font-bold text-foreground uppercase">El video comenzará en {adTimer} segundos</p>
              </div>
            ) : <Play className="h-24 w-24 text-accent1 opacity-20 animate-pulse" />}
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-mono font-black text-foreground uppercase tracking-tighter leading-none">{movie.title}</h1>
            <div className="bg-bgSecondary/30 p-6 rounded-2xl border-1-4 border-accent1">
              <p className="text-textSecondary text-lg font-medium italic">{movie.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleFavorite}
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all shadow-lg uppercase tracking-widest",
                isFav ? "bg-accent3 text-white" : "bg-accent1 text-bgPrimary hover:scale-105"
              )}
            >
              <Heart className={cn("w-5 h-5", isFav && "fill-current")} />
              {isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
            </button>
            <button className="flex items-center gap-2 border-2 border-accent1 text-foreground px-8 py-4 rounded-full font-bold text-sm hover:bg-accent1 hover:text-bgPrimary transition-all uppercase tracking-widest">
              <Share2 className="w-5 h-5" /> Compartir
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-mono text-xl font-black text-foreground uppercase tracking-widest border-b-2 border-accent1 pb-2">Más como esto</h3>
          <div className="space-y-4">
            {relatedMovies.map((rel) => (
              <Link href={`/watch/${rel._id}`} key={rel._id} className="group flex gap-4 p-3 rounded-xl bg-bgSecondary/20 border border-border hover:border-accent1 transition-all">
                <div className="w-32 aspect-video bg-bgPrimary rounded-lg overflow-hidden shrink-0 relative">
                  <img src={rel.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="text-accent1 w-6 h-6" />
                  </div>
                </div>
                <div className="py-1">
                  <h4 className="text-[11px] font-black text-foreground uppercase group-hover:text-accent1 line-clamp-1">{rel.title}</h4>
                  <p className="text-[9px] text-accent2 font-bold uppercase tracking-widest">{rel.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}