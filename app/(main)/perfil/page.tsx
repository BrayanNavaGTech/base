"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Shield, CreditCard, LogOut, Heart, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const user = useQuery(api.users.getUserByEmail, { email: email ?? "" });
  const favMovies = useQuery(api.favorites.getMyFavorites, 
    user?._id ? { userId: user._id } : "skip"
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    if (!storedEmail) {
      router.push("/login");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_email");
    router.push("/");
    router.refresh();
  };

  if (user === undefined) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent1 h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-12 animate-in fade-in zoom-in duration-500">
      <div className="relative overflow-hidden bg-[rgba(249,183,255,0.05)] border-2 border-accent1 rounded-[40px] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent1 opacity-5 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} className="w-32 h-32 rounded-full border-4 border-accent1 bg-bgSecondary" />
          <div className="text-center md:text-left space-y-2 flex-1">
            <h1 className="font-mono text-4xl font-black text-foreground uppercase tracking-tighter">{user?.name}</h1>
            <p className="font-sans text-textSecondary text-lg italic">{user?.email}</p>
            <div className="bg-accent1/10 px-4 py-2 rounded-2xl border border-accent1/20 inline-block mt-4">
              <p className="text-[9px] text-accent1 font-black uppercase tracking-widest">Plan: {user?.plan}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 border-2 border-accent3 text-accent3 hover:bg-accent3 hover:text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all">
            <LogOut className="w-4 h-4" /> CERRAR SESIÓN
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 bg-[rgba(249,183,255,0.08)] p-4 px-8 rounded-full border border-accent1/30 w-fit">
          <Heart className="w-5 h-5 text-accent1 fill-accent1" />
          <h2 className="font-mono text-xl font-black text-foreground uppercase tracking-widest">Mis Favoritas</h2>
        </div>

        {favMovies === undefined ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-accent1" /></div>
        ) : favMovies.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-[30px]">
            <p className="text-textSecondary font-mono text-sm uppercase font-bold italic">No tienes favoritos guardados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favMovies.map((movie) => (
              <Link href={`/watch/${movie._id}`} key={movie._id} className="group">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border-2 border-border bg-bgSecondary/20 transition-all duration-500 group-hover:border-accent1 group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(249,183,255,0.2)]">
                  <img src={movie.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-bgPrimary/40">
                    <Play className="text-accent1 fill-accent1 w-10 h-10" />
                  </div>
                </div>
                <h3 className="mt-3 text-[10px] font-black text-foreground uppercase truncate group-hover:text-accent1">{movie.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-bgSecondary/20 border-2 border-border rounded-[30px] p-8">
          <h3 className="font-mono text-lg font-black text-foreground uppercase tracking-widest flex items-center gap-3 mb-4"><Mail className="text-accent1 w-5 h-5" /> Cuenta</h3>
          <p className="text-sm font-bold text-foreground bg-background/50 p-4 rounded-xl border border-border">{user?.email}</p>
        </div>
        <div className="bg-gradient-to-br from-bgSecondary to-bgPrimary border-2 border-accent1 rounded-[30px] p-8 flex justify-between items-center shadow-xl">
          <div>
            <h3 className="font-mono text-lg font-black text-white uppercase tracking-widest mb-1">Suscripción</h3>
            <p className="text-2xl font-black text-accent1 uppercase italic">{user?.plan}</p>
          </div>
          <Link href="/planes" className="bg-accent1 text-bgPrimary px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">CAMBIAR</Link>
        </div>
      </div>
    </div>
  );
}