"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Film, Image as ImageIcon, Video, Hash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const currentUser = useQuery(api.users.getUserByEmail, { email: email ?? "" });
  
  const createMovieMutation = useMutation(api.movies.createMovie);

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    category: "",
    youtubeUrl: "",
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    if (!storedEmail) {
      router.push("/login");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await createMovieMutation({
        title: form.title,
        description: form.description,
        thumbnail: form.thumbnail,
        category: form.category,
        youtubeUrl: form.youtubeUrl,
        userEmail: email 
      });
      
      alert("SISTEMA ACTUALIZADO: PELÍCULA INYECTADA");
      setForm({ title: "", description: "", thumbnail: "", category: "", youtubeUrl: "" });
    } catch (error) {
      console.error(error);
      alert("ERROR: No tienes permisos o faltan datos");
    }
  };

  if (currentUser === undefined) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent1 h-12 w-12" />
      </div>
    );
  }

  if (currentUser === null) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl animate-in fade-in zoom-in duration-500">
      <Card className="bg-bgSecondary/20 border-2 border-accent1 shadow-[0_0_50px_rgba(249,183,255,0.1)] backdrop-blur-xl rounded-[40px] overflow-hidden">
        <CardHeader className="bg-[rgba(249,183,255,0.05)] border-b border-accent1/20 py-10">
          <CardTitle className="font-mono text-3xl text-accent1 text-center tracking-tighter uppercase italic drop-shadow-[0_0_10px_rgba(249,183,255,0.5)]">
            ADMIN ACCESS: {currentUser.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-accent1 uppercase tracking-widest ml-1">
                  <Film className="w-3 h-3" /> Título
                </label>
                <Input
                  placeholder="NOMBRE"
                  value={form.title}
                  className="bg-bgPrimary/50 border-2 border-accent1/20 text-white rounded-2xl h-12 focus:border-accent1 font-mono italic"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-accent1 uppercase tracking-widest ml-1">
                  <Hash className="w-3 h-3" /> Género
                </label>
                <Input
                  placeholder="CATEGORÍA"
                  value={form.category}
                  className="bg-bgPrimary/50 border-2 border-accent1/20 text-white rounded-2xl h-12 focus:border-accent1 font-mono italic"
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-accent1 uppercase tracking-widest ml-1">
                <ImageIcon className="w-3 h-3" /> URL Miniatura
              </label>
              <Input
                placeholder="https://..."
                value={form.thumbnail}
                className="bg-bgPrimary/50 border-2 border-accent1/20 text-white rounded-2xl h-12 focus:border-accent1"
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-accent1 uppercase tracking-widest ml-1">
                <Video className="w-3 h-3" /> Link YouTube
              </label>
              <Input
                placeholder="https://youtube.com/..."
                value={form.youtubeUrl}
                className="bg-bgPrimary/50 border-2 border-accent1/20 text-white rounded-2xl h-12 focus:border-accent1"
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-accent1 uppercase tracking-widest ml-1">Sinopsis</label>
              <Textarea
                placeholder="Descripción..."
                value={form.description}
                className="bg-bgPrimary/50 border-2 border-accent1/20 text-white rounded-2xl min-h-[120px] focus:border-accent1 italic"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-accent1 hover:bg-accent1/90 text-bgPrimary font-black h-16 rounded-2xl text-sm uppercase tracking-[0.3em] shadow-lg transition-all"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Inyectar Película
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}