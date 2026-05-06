import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TopNav } from "@/components/TopNav";
import { MotivationalFooter } from "@/components/MotivationalFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Briefcase, BookOpen, Sparkles, TrendingUp, ChevronRight } from "lucide-react";

type Skill = { name: string; category: string; level: string; market_demand: string; evidence: string };
type Job = { title: string; area: string; level: string; reason: string };
type Course = { title: string; duration: string; focus: string; why: string };

const levelColor = (lvl: string) =>
  lvl === "Sênior" ? "bg-gold/15 text-gold border-gold/30"
  : lvl === "Pleno" ? "bg-gold-soft/15 text-gold-soft border-gold-soft/30"
  : "bg-secondary text-foreground/70 border-border";

const demandColor = (d: string) =>
  d === "Alta" ? "text-gold" : d === "Média" ? "text-gold-soft" : "text-muted-foreground";

const Resultados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ready } = useAuthGuard();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !id) return;
    (async () => {
      const { data, error } = await supabase.from("assessments").select("*").eq("id", id).maybeSingle();
      if (!error) setData(data);
      setLoading(false);
    })();
  }, [ready, id]);

  if (!ready || loading) return (
    <div className="flex flex-col min-h-dvh"><TopNav /><div className="flex-1 flex items-center justify-center text-muted-foreground">Carregando...</div><MotivationalFooter /></div>
  );

  if (!data) return (
    <div className="flex flex-col min-h-dvh"><TopNav />
      <div className="flex-1 container mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Mapeamento não encontrado</h1>
        <Button variant="hero" onClick={() => navigate("/perfil")}>Ir para o perfil</Button>
      </div><MotivationalFooter />
    </div>
  );

  const skills: Skill[] = data.skills ?? [];
  const jobs: Job[] = data.jobs ?? [];
  const courses: Course[] = data.courses ?? [];

  return (
    <div className="flex flex-col min-h-dvh">
      <TopNav />
      <main className="flex-1 container mx-auto px-6 py-12 max-w-5xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold/90">Seu mapeamento</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-balance leading-[1.05]">
            Você é <span className="text-gold italic">{data.overall_level}</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">{data.summary}</p>
        </div>

        {/* Skills map */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-3xl">Mapa de habilidades</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((s) => (
              <div key={s.name} className="gradient-card border border-border/60 rounded-2xl p-6 hover:border-gold/40 transition-colors">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <h3 className="font-serif text-xl">{s.name}</h3>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.category}</p>
                  </div>
                  <Badge variant="outline" className={levelColor(s.level)}>{s.level}</Badge>
                </div>
                <p className="text-sm text-muted-foreground italic mb-3">"{s.evidence}"</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Demanda no mercado:</span>
                  <span className={`font-medium ${demandColor(s.market_demand)}`}>{s.market_demand}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-3xl">Cargos recomendados</h2>
          </div>
          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.title} className="gradient-card border border-border/60 rounded-2xl p-6 flex items-start justify-between gap-4 hover:border-gold/40 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-xl">{j.title}</h3>
                    <Badge variant="outline" className={levelColor(j.level)}>{j.level}</Badge>
                  </div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{j.area}</p>
                  <p className="text-sm text-muted-foreground">{j.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Courses */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-3xl">Cursos sugeridos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {courses.map((c) => (
              <div key={c.title} className="gradient-card border border-border/60 rounded-2xl p-6 hover:border-gold/40 transition-colors">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h3 className="font-serif text-lg flex-1">{c.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold whitespace-nowrap">{c.duration}</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{c.focus}</p>
                <p className="text-sm text-muted-foreground">{c.why}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 justify-center pt-6">
          <Button variant="hero" size="lg" asChild><Link to="/perfil">Ver meu perfil <ChevronRight className="w-4 h-4" /></Link></Button>
          <Button variant="gold" size="lg" onClick={() => navigate("/questionario")}>Fazer novo mapeamento</Button>
        </div>
      </main>
      <MotivationalFooter />
    </div>
  );
};

export default Resultados;
