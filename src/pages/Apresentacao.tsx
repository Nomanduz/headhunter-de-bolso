import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/TopNav";
import { MotivationalFooter } from "@/components/MotivationalFooter";
import { Play, ChevronRight } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const Apresentacao = () => {
  const navigate = useNavigate();
  const { ready } = useAuthGuard();
  if (!ready) return null;

  return (
    <div className="flex flex-col min-h-dvh">
      <TopNav />
      <main className="flex-1 container mx-auto px-6 py-12 flex items-center justify-center">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5">
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Boas-vindas</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-balance leading-[1.05]">
            Em <span className="text-gold italic">1 minuto</span>, entenda o que vem por aí.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Você vai responder 10 perguntas abertas. Não há respostas certas ou erradas — quanto mais sincero(a), mais preciso será o mapeamento que nossa IA fará da sua carreira.
          </p>

          <div className="relative aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden gradient-card border border-gold/20 shadow-elegant flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
            <div className="relative w-20 h-20 rounded-full gradient-gold flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
              <Play className="w-8 h-8 text-navy-deep ml-1" fill="currentColor" />
            </div>
            <span className="absolute bottom-4 right-4 text-xs text-muted-foreground">Vídeo • 1:00</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4">
            {[
              { n: "10", l: "perguntas" },
              { n: "~8min", l: "para concluir" },
              { n: "100%", l: "personalizado" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border/60 bg-secondary/30 p-4">
                <div className="font-serif text-3xl text-gold">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <Button variant="hero" size="lg" onClick={() => navigate("/questionario")}>
            Iniciar perguntas <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
      <MotivationalFooter />
    </div>
  );
};

export default Apresentacao;
