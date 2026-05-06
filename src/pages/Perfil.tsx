import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TopNav } from "@/components/TopNav";
import { MotivationalFooter } from "@/components/MotivationalFooter";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Sparkles, Clock, ChevronRight, Play } from "lucide-react";

const Perfil = () => {
  const { ready } = useAuthGuard();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [{ data: p }, { data: a }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle(),
        supabase.from("assessments").select("id, status, overall_level, summary, created_at").eq("user_id", u.user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(p);
      setAssessments(a ?? []);
    })();
  }, [ready]);

  if (!ready) return null;

  const inProgress = assessments.find((a) => a.status === "in_progress");
  const completed = assessments.filter((a) => a.status === "completed");

  return (
    <div className="flex flex-col min-h-dvh">
      <TopNav />
      <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl w-full space-y-12">
        <header className="space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-gold/80">Seu perfil</span>
          <h1 className="font-serif text-5xl text-balance leading-[1.05]">
            Olá, <span className="text-gold italic">{profile?.full_name?.split(" ")[0] ?? "você"}</span>.
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Aqui você acompanha seus mapeamentos, revê recomendações e inicia novas análises.
          </p>
        </header>

        {/* CTA */}
        <section className="gradient-card border border-gold/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-elegant">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gold text-sm">
              <Sparkles className="w-4 h-4" /> Pronto para um novo mapeamento?
            </div>
            <h2 className="font-serif text-2xl">{inProgress ? "Continue de onde parou" : "Comece um novo diagnóstico"}</h2>
            <p className="text-sm text-muted-foreground">10 perguntas. Análise IA completa em segundos.</p>
          </div>
          <Button variant="hero" size="lg" onClick={() => navigate(inProgress ? "/questionario" : "/apresentacao")}>
            {inProgress ? <>Retomar <ChevronRight className="w-4 h-4" /></> : <><Play className="w-4 h-4" /> Iniciar</>}
          </Button>
        </section>

        {/* Apresentação reutilizável */}
        <section>
          <h2 className="font-serif text-2xl mb-4">Vídeo de apresentação</h2>
          <Link to="/apresentacao" className="block gradient-card border border-border/60 rounded-2xl p-6 hover:border-gold/40 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-gold ml-0.5" fill="currentColor" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Como o mapeamento funciona</div>
              <div className="text-sm text-muted-foreground">Reveja o vídeo de boas-vindas (1 min)</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </section>

        {/* Histórico */}
        <section>
          <h2 className="font-serif text-2xl mb-4">Histórico de mapeamentos</h2>
          {completed.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Nenhum mapeamento concluído ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {completed.map((a) => (
                <Link key={a.id} to={`/resultados/${a.id}`} className="block gradient-card border border-border/60 rounded-2xl p-6 hover:border-gold/40 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full border border-gold/30 bg-gold/5 text-gold">{a.overall_level}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(a.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{a.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <MotivationalFooter />
    </div>
  );
};

export default Perfil;
