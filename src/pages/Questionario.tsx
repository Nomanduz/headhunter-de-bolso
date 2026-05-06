import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QUESTIONS } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TopNav } from "@/components/TopNav";
import { MotivationalFooter } from "@/components/MotivationalFooter";
import { toast } from "sonner";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";

const Questionario = () => {
  const navigate = useNavigate();
  const { ready } = useAuthGuard();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(""));
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const initRan = useRef(false);

  // Initialize / resume assessment
  useEffect(() => {
    if (!ready || initRan.current) return;
    initRan.current = true;
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) return;

      const { data: existing } = await supabase
        .from("assessments")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "in_progress")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let id = existing?.id;
      if (!id) {
        const { data: created, error } = await supabase
          .from("assessments")
          .insert({ user_id: userId })
          .select("id")
          .single();
        if (error) { toast.error(error.message); return; }
        id = created.id;
      } else {
        const { data: prev } = await supabase
          .from("answers")
          .select("question_index, answer_text")
          .eq("assessment_id", id);
        if (prev) {
          const fresh = Array(QUESTIONS.length).fill("");
          prev.forEach((a) => { fresh[a.question_index] = a.answer_text; });
          setAnswers(fresh);
          const next = fresh.findIndex((a) => !a.trim());
          setIndex(next === -1 ? QUESTIONS.length - 1 : next);
        }
      }
      setAssessmentId(id);
    })();
  }, [ready]);

  const saveCurrent = async (text: string) => {
    if (!assessmentId) return;
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id;
    if (!userId) return;
    setSaving(true);
    await supabase.from("answers").upsert({
      assessment_id: assessmentId,
      user_id: userId,
      question_index: index,
      question_text: QUESTIONS[index],
      answer_text: text,
    }, { onConflict: "assessment_id,question_index" });
    setSaving(false);
  };

  const handleChange = (val: string) => {
    const next = [...answers];
    next[index] = val;
    setAnswers(next);
  };

  // autosave on blur or when moving
  const goNext = async () => {
    await saveCurrent(answers[index]);
    if (index < QUESTIONS.length - 1) setIndex(index + 1);
  };
  const goPrev = async () => {
    await saveCurrent(answers[index]);
    if (index > 0) setIndex(index - 1);
  };

  const finish = async () => {
    if (!assessmentId) return;
    if (answers.some((a) => !a.trim())) { toast.error("Responda todas as 10 perguntas."); return; }
    await saveCurrent(answers[index]);
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-assessment", {
        body: { answers: QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] })) },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);

      await supabase.from("assessments").update({
        status: "completed",
        overall_level: data.overall_level,
        skills: data.skills,
        jobs: data.jobs,
        courses: data.courses,
        summary: data.summary,
      }).eq("id", assessmentId);

      navigate(`/resultados/${assessmentId}`);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao analisar respostas");
      setAnalyzing(false);
    }
  };

  if (!ready) return null;

  const progress = ((index + 1) / QUESTIONS.length) * 100;
  const isLast = index === QUESTIONS.length - 1;

  return (
    <div className="flex flex-col min-h-dvh">
      <TopNav />
      <main className="flex-1 container mx-auto px-6 py-12 max-w-2xl w-full">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
          <span>Pergunta {index + 1} de {QUESTIONS.length}</span>
          <span className="flex items-center gap-1.5">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3 text-gold" />}
            {saving ? "Salvando..." : "Salvo"}
          </span>
        </div>
        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden mb-10">
          <div className="h-full gradient-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="gradient-card border border-border/60 rounded-2xl p-8 shadow-elegant space-y-6">
          <h1 className="font-serif text-3xl md:text-4xl text-balance leading-tight">
            {QUESTIONS[index]}
          </h1>
          <Textarea
            value={answers[index]}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={(e) => saveCurrent(e.target.value)}
            placeholder="Escreva com suas próprias palavras. Pode ser tão curto ou detalhado quanto quiser."
            className="min-h-[180px] text-base resize-none bg-input/60 border-border/60 focus-visible:ring-gold"
            autoFocus
          />
          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" onClick={goPrev} disabled={index === 0}>
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Button>
            {isLast ? (
              <Button variant="hero" size="lg" onClick={finish} disabled={analyzing}>
                {analyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analisando...</> : <>Finalizar e ver resultado <ChevronRight className="w-4 h-4" /></>}
              </Button>
            ) : (
              <Button variant="hero" onClick={goNext} disabled={!answers[index].trim()}>
                Próxima <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <MotivationalFooter />
    </div>
  );
};

export default Questionario;
