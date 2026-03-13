import Navbar from "@/components/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t border-border bg-background/50 py-10 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-black text-accent1 italic">TRAILIX</span>
            <span className="text-[10px] text-textSecondary font-bold uppercase tracking-widest">© 2026 Prototype</span>
          </div>
          <p className="text-[10px] text-textSecondary font-medium uppercase tracking-[0.2em]">
            Diseñado para la eficiencia visual y estructural
          </p>
        </div>
      </footer>
    </div>
  );
}