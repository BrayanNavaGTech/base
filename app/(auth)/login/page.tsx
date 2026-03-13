"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AccessPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const registerUser = useMutation(api.users.register);
  const router = useRouter();

  const handleAction = async (type: "login" | "register") => {
    try {
      if (type === "register") {
        await registerUser({ 
          name: form.name, 
          email: form.email, 
          password: form.password 
        });
        localStorage.setItem("user_email", form.email);
        router.push("/");
        router.refresh();
      } else {
        localStorage.setItem("user_email", form.email);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      alert("Error: " + (error instanceof Error ? error.message : "Error desconocido"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bgPrimary p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent1 opacity-10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent3 opacity-10 blur-[120px] rounded-full animate-pulse" />

      <div className="w-full max-w-[450px] z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-[rgba(249,183,255,0.1)] border-2 border-accent1 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,183,255,0.3)] mb-6">
            <svg width="40" height="40" viewBox="0 0 616 661" fill="none">
              <path d="M 602 43 L 57 43 L 24 183 L 185 185 L 99 622 L 180 620 L 218 601 L 534 277 L 555 242 Z M 328 202 L 339 206 L 457 271 L 464 279 L 465 285 L 462 293 L 458 298 L 404 326 L 354 355 L 331 367 L 325 368 L 320 367 L 314 363 L 310 356 L 310 217 L 313 209 L 320 203 Z" fill="#F9B7FF" fillRule="evenodd"/>
            </svg>
          </div>
          <h1 className="font-mono text-4xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(249,183,255,0.5)]">
            TRAILIX <span className="text-accent1">ACCESS</span>
          </h1>
          <p className="text-textSecondary font-medium italic tracking-wide">
            Sincroniza tu perfil con el núcleo del sistema.
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[rgba(249,183,255,0.05)] border-2 border-[rgba(249,183,255,0.2)] rounded-full p-1.5 h-14 backdrop-blur-md">
            <TabsTrigger 
              value="login" 
              className="rounded-full data-[state=active]:bg-accent1 data-[state=active]:text-bgPrimary text-accent1 font-black uppercase tracking-widest transition-all text-xs"
            >
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="rounded-full data-[state=active]:bg-accent1 data-[state=active]:text-bgPrimary text-accent1 font-black uppercase tracking-widest transition-all text-xs"
            >
              Registrarse
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 bg-[rgba(249,183,255,0.03)] border-2 border-[rgba(249,183,255,0.15)] rounded-[35px] p-8 backdrop-blur-xl shadow-2xl">
            <TabsContent value="login" className="space-y-6 mt-0 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-accent2 uppercase tracking-[0.2em] ml-2">Email del Usuario</label>
                <Input
                  type="email"
                  placeholder="USER@TRAILIX.SYS"
                  className="bg-[rgba(249,183,255,0.05)] border-2 border-[rgba(249,183,255,0.1)] text-white h-12 rounded-2xl focus:border-accent1 focus:ring-0 transition-all placeholder:text-gray-600 font-mono italic"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-accent2 uppercase tracking-[0.2em] ml-2">Clave de Acceso</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-[rgba(249,183,255,0.05)] border-2 border-[rgba(249,183,255,0.1)] text-white h-12 rounded-2xl focus:border-accent1 focus:ring-0 transition-all placeholder:text-gray-600 font-mono"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <Button 
                onClick={() => handleAction("login")}
                className="w-full bg-accent1 hover:bg-accent1/90 text-bgPrimary font-black h-14 rounded-2xl text-sm uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(249,183,255,0.2)] hover:scale-[1.02] transition-all active:scale-95"
              >
                Iniciar
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-5 mt-0 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-accent2 uppercase tracking-[0.2em] ml-2">Nombre Completo</label>
                <Input
                  placeholder="IDENTIDAD VISUAL"
                  className="bg-[rgba(249,183,255,0.05)] border-2 border-[rgba(249,183,255,0.1)] text-white h-12 rounded-2xl focus:border-accent1 transition-all placeholder:text-gray-600 font-mono italic"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-accent2 uppercase tracking-[0.2em] ml-2">Email</label>
                <Input
                  type="email"
                  placeholder="USER@TRAILIX.SYS"
                  className="bg-[rgba(249,183,255,0.05)] border-2 border-[rgba(249,183,255,0.1)] text-white h-12 rounded-2xl focus:border-accent1 transition-all placeholder:text-gray-600 font-mono italic"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-accent2 uppercase tracking-[0.2em] ml-2">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-[rgba(249,183,255,0.05)] border-2 border-[rgba(249,183,255,0.1)] text-white h-12 rounded-2xl focus:border-accent1 transition-all placeholder:text-gray-600 font-mono"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <Button 
                onClick={() => handleAction("register")}
                className="w-full bg-accent1 hover:bg-accent1/90 text-bgPrimary font-black h-14 rounded-2xl text-sm uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(249,183,255,0.2)] hover:scale-[1.02] transition-all mt-2"
              >
                CREAR REGISTRO
              </Button>
            </TabsContent>
          </div>
        </Tabs>

        <p className="text-center text-[10px] text-textSecondary font-bold uppercase tracking-widest opacity-50">
          Cifrado de extremo a extremo • Trailix Prototype 2026
        </p>
      </div>
    </div>
  );
}