import { QUOTE, QUOTE_AUTHOR } from "@/lib/questions";

export const MotivationalFooter = () => (
  <footer className="mt-auto border-t border-border/40 bg-navy-deep/40 backdrop-blur-sm">
    <div className="container mx-auto px-6 py-8 text-center">
      <p className="font-serif text-base md:text-lg text-foreground/80 italic text-balance max-w-2xl mx-auto leading-relaxed">
        "{QUOTE}"
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gold/70">— {QUOTE_AUTHOR}</p>
    </div>
  </footer>
);
