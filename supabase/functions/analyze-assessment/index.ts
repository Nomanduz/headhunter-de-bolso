import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Require authenticated user to prevent abuse of AI credits
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabaseAuth.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { answers } = await req.json();
    if (!Array.isArray(answers) || answers.length === 0) {
      return new Response(JSON.stringify({ error: "answers obrigatórias" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const userBlock = answers
      .map((a: any, i: number) => `P${i + 1}: ${a.question}\nR${i + 1}: ${a.answer}`)
      .join("\n\n");

    const systemPrompt = `Você é um headhunter sênior brasileiro especialista em mapeamento de carreira.
Analise as respostas do usuário e produza um diagnóstico claro, acionável e acolhedor em PORTUGUÊS DO BRASIL.
Identifique habilidades comportamentais, técnicas e pessoais. Para cada habilidade, classifique como Júnior, Pleno ou Sênior baseado nas evidências.
Sugira cargos compatíveis e cursos curtos (de preferência <40h) com alta empregabilidade.
Sempre baseie recomendações em evidências das respostas (campo "evidence").`;

    const tool = {
      type: "function",
      function: {
        name: "deliver_assessment",
        description: "Devolve a análise de carreira completa.",
        parameters: {
          type: "object",
          properties: {
            overall_level: { type: "string", enum: ["Júnior", "Pleno", "Sênior"] },
            summary: { type: "string", description: "Resumo de 2-3 frases sobre o perfil do usuário." },
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  category: { type: "string", enum: ["Comportamental", "Técnica", "Pessoal"] },
                  level: { type: "string", enum: ["Júnior", "Pleno", "Sênior"] },
                  market_demand: { type: "string", enum: ["Baixa", "Média", "Alta"] },
                  evidence: { type: "string" },
                },
                required: ["name", "category", "level", "market_demand", "evidence"],
                additionalProperties: false,
              },
            },
            jobs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  area: { type: "string" },
                  level: { type: "string", enum: ["Júnior", "Pleno", "Sênior"] },
                  reason: { type: "string" },
                },
                required: ["title", "area", "level", "reason"],
                additionalProperties: false,
              },
            },
            courses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  duration: { type: "string", description: "ex: 8h, 20h, 40h" },
                  focus: { type: "string" },
                  why: { type: "string" },
                },
                required: ["title", "duration", "focus", "why"],
                additionalProperties: false,
              },
            },
          },
          required: ["overall_level", "summary", "skills", "jobs", "courses"],
          additionalProperties: false,
        },
      },
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Aqui estão as respostas:\n\n${userBlock}\n\nRetorne entre 6 e 10 habilidades, 3 a 5 cargos e 3 a 5 cursos.` },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "deliver_assessment" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro na análise IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("IA não retornou tool call");
    const result = JSON.parse(call.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-assessment error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
