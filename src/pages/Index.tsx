import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/TopNav";
import { MotivationalFooter } from "@/components/MotivationalFooter";
import heroImg from "@/assets/hero-illustration.jpg";
import { Sparkles, Target, BookOpen, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-dvh">
      <TopNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-5 sm:px-6 pt-4 sm:pt-10 pb-12 sm:pb-20 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-5 sm:space-y-7 lg:space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5">
                <Sparkles className="w-3 h-3 text-gold" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-gold/90">Consultoria de carreira instantânea</span>
              </div>
              <h1 className="font-serif text-[2rem] leading-[1.08] sm:text-5xl md:text-6xl text-balance">
                Seu futuro profissional, <span className="text-gold italic">mapeado</span> em minutos.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl text-pretty leading-relaxed">
                Responda 10 perguntas simples e deixe nossa IA desvendar suas habilidades, seu nível profissional e o caminho ideal para sua próxima conquista.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button variant="hero" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/auth?mode=signup")}>
                  Começar mapeamento <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="gold" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/auth")}>Já tenho conta</Button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-muted-foreground">
                <span>⏱ Menos de 10 minutos</span>
                <span>✦ 100% gratuito</span>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 max-w-[260px] sm:max-w-sm mx-auto lg:max-w-none w-full">
              <div className="absolute -inset-6 bg-gold/5 rounded-full blur-3xl" />
              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-gold/20 shadow-elegant">
                <img
                  src={heroImg}
                  alt="Headhunters avaliando candidatos profissionais com lupas"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 py-20 border-t border-border/40">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-balance">Como funciona</h2>
            <p className="text-muted-foreground text-lg">Três passos para enxergar sua carreira com clareza.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Conte sua história", desc: "10 perguntas abertas sobre o que você sabe, gosta e faz bem." },
              { icon: Target, title: "Descubra seu nível", desc: "Nossa IA classifica cada habilidade em Júnior, Pleno ou Sênior." },
              { icon: BookOpen, title: "Receba o caminho", desc: "Vagas compatíveis e cursos curtos para acelerar sua próxima fase." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="gradient-card border border-border/60 rounded-2xl p-8 hover:border-gold/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-serif text-2xl mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button variant="hero" size="lg" onClick={() => navigate("/auth?mode=signup")}>
              Quero meu mapeamento <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>

      <MotivationalFooter />
    </div>
  );
};

export default Index;
