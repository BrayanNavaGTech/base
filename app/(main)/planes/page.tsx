"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Star, Zap, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function PlanesPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const user = useQuery(api.users.getUserByEmail, { email: email ?? "" });
  const updatePlan = useMutation(api.users.updatePlan);

  useEffect(() => {
    setEmail(localStorage.getItem("user_email"));
  }, []);

  const handlePlanChange = async (newPlan: "free" | "basic" | "premium") => {
    if (!email) return router.push("/login");
    try {
      await updatePlan({ email, newPlan });
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const planes = [
    {
      name: "free",
      title: "BRONCE",
      price: "GRATIS",
      icon: <Play className="w-6 h-6" />,
      description: "Estructura básica para visualización ocasional.",
      features: ["Anuncios de 30 segundos", "Calidad Estándar", "1 Dispositivo", "Acceso al catálogo"],
      accent: "rgba(249, 183, 255, 0.2)"
    },
    {
      name: "basic",
      title: "PLATA",
      price: "$9.99",
      icon: <Zap className="w-6 h-6" />,
      description: "Optimización técnica para usuarios frecuentes.",
      features: ["Anuncios de 5 segundos", "Calidad HD (1080p)", "2 Dispositivos", "Soporte prioritario"],
      accent: "rgba(244, 116, 254, 0.4)"
    },
    {
      name: "premium",
      title: "ORO",
      price: "$19.99",
      icon: <Star className="w-6 h-6" />,
      description: "La cumbre de la fidelidad visual Trailix.",
      features: ["Sin anuncios", "Calidad 4K HDR", "4 Dispositivos", "Contenido exclusivo"],
      accent: "#EA40F5"
    }
  ];

  if (user === undefined) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent1 h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 space-y-16 animate-in fade-in duration-700">
      <div className="text-center space-y-6 relative py-10 bg-[rgba(249,183,255,0.05)] border-2 border-accent1 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-1)_0%,transparent_70%)] opacity-10 animate-pulse" />
        <h1 className="font-mono text-5xl md:text-7xl font-black tracking-tighter text-white uppercase relative z-10 drop-shadow-[0_0_15px_rgba(249,183,255,0.3)]">
          NIVELES DE <span className="text-accent1">ACCESO</span>
        </h1>
        <p className="font-sans text-textSecondary max-w-2xl mx-auto text-lg font-medium relative z-10">
          Selecciona la arquitectura de suscripción que mejor se adapte a tus necesidades de procesamiento visual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {planes.map((plan) => (
          <div 
            key={plan.name}
            className={cn(
              "relative flex flex-col p-8 rounded-[35px] border-2 transition-all duration-500 bg-[rgba(249,183,255,0.03)] backdrop-blur-xl group",
              user?.plan === plan.name 
                ? "border-accent1 shadow-[0_0_40px_rgba(249,183,255,0.2)] scale-105" 
                : "border-[rgba(249,183,255,0.2)] hover:border-accent1 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(249,183,255,0.15)]"
            )}
          >
            {user?.plan === plan.name && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent1 text-bgPrimary px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                Actual
              </div>
            )}

            <div className="flex justify-between items-start mb-8">
              <div className="p-4 rounded-2xl bg-[rgba(249,183,255,0.1)] text-accent1 group-hover:scale-110 transition-transform duration-500">
                {plan.icon}
              </div>
              <div className="text-right">
                <p className="font-mono text-3xl font-black text-white">{plan.price}</p>
                <p className="text-[10px] text-accent2 font-bold uppercase tracking-widest">por mes</p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <h3 className="font-mono text-2xl font-black text-white uppercase tracking-tighter">
                {plan.title}
              </h3>
              <p className="text-sm text-textSecondary font-medium leading-relaxed italic">
                {plan.description}
              </p>
            </div>

            <ul className="space-y-4 mb-12 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 group/item">
                  <div className="h-5 w-5 rounded-full border border-accent1 flex items-center justify-center shrink-0 group-hover/item:bg-accent1 transition-colors">
                    <Check className="h-3 w-3 text-accent1 group-hover/item:text-bgPrimary transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wide group-hover/item:text-white transition-colors">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanChange(plan.name as any)}
              disabled={user?.plan === plan.name}
              className={cn(
                "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300",
                user?.plan === plan.name
                  ? "bg-[rgba(249,183,255,0.1)] text-accent1 border border-accent1/30 cursor-not-allowed"
                  : plan.name === "premium"
                  ? "bg-accent1 text-bgPrimary hover:shadow-[0_0_30px_rgba(249,183,255,0.5)] hover:scale-105"
                  : "border-2 border-accent1 text-accent1 hover:bg-accent1 hover:text-bgPrimary"
              )}
            >
              {user?.plan === plan.name ? "ACCESO ACTIVADO" : "ACTUALIZAR NIVEL"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 rounded-[40px] bg-[rgba(249,183,255,0.03)] border-2 border-dashed border-[rgba(249,183,255,0.2)] text-center space-y-6">
        <h2 className="font-mono text-2xl font-black text-white uppercase tracking-widest italic">
          Garantía de Fidelidad Trailix
        </h2>
        <p className="text-textSecondary text-sm font-medium max-w-2xl mx-auto">
          Nuestros sistemas de cifrado aseguran que tu suscripción local sea procesada con la máxima eficiencia geométrica. Sin letras pequeñas, solo rectángulos puros.
        </p>
      </div>
    </div>
  );
}