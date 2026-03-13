"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  Moon, 
  Sun,
  LayoutGrid,
  Sparkles,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [email, setEmail] = useState<string | null>(null);
  
  const user = useQuery(api.users.getUserByEmail, { email: email ?? "" });

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    setEmail(storedEmail);

    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  const navLinks = [
    { name: "Inicio", href: "/", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Catálogo", href: "/catalogo", icon: <LayoutGrid className="w-4 h-4" /> },
    { name: "Planes", href: "/planes", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-border bg-background/80 backdrop-blur-md px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-accent1 blur-md opacity-20 group-hover:opacity-50 transition-opacity" />
            <svg width="35" height="35" viewBox="0 0 616 661" fill="none" className="relative z-10 transition-transform group-hover:scale-110">
              <path d="M 602 43 L 57 43 L 24 183 L 185 185 L 99 622 L 180 620 L 218 601 L 534 277 L 555 242 Z M 328 202 L 339 206 L 457 271 L 464 279 L 465 285 L 462 293 L 458 298 L 404 326 L 354 355 L 331 367 L 325 368 L 320 367 L 314 363 L 310 356 L 310 217 L 313 209 L 320 203 Z" fill="currentColor" className="text-accent1" fillRule="evenodd"/>
            </svg>
          </div>
          <span className="font-mono text-2xl font-black tracking-tighter text-foreground uppercase italic group-hover:text-accent1 transition-colors">
            TRAILIX
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-accent1",
                pathname === link.href ? "text-accent1" : "text-textSecondary"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center bg-secondary border border-border rounded-full px-4 py-2 group focus-within:border-accent1 transition-all">
            <Search className="w-4 h-4 text-textSecondary group-focus-within:text-accent1" />
            <input 
              type="text" 
              placeholder="BUSCAR..." 
              className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest px-3 w-32 focus:w-48 transition-all placeholder:text-textSecondary/50"
            />
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-secondary border border-border text-accent1 hover:scale-110 transition-all hover:shadow-[0_0_15px_rgba(249,183,255,0.2)]"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {email ? (
            <Link href="/perfil" className="relative group">
              <div className="absolute inset-0 bg-accent1 rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity" />
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-accent1 relative z-10 bg-bgSecondary"
              />
            </Link>
          ) : (
            <Link href="/login">
              <button className="bg-accent1 text-bgPrimary px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                ACCESO
              </button>
            </Link>
          )}

          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-6 space-y-4 animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-textSecondary hover:text-accent1"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}