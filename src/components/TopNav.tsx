import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export const TopNav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="container mx-auto px-5 sm:px-6 py-4 sm:py-6 flex justify-between items-center gap-3">
      <Link to={user ? "/perfil" : "/"} className="flex items-center gap-2 sm:gap-3 group min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg gradient-gold flex items-center justify-center font-serif text-navy-deep text-base sm:text-lg shadow-gold shrink-0">H</div>
        <span className="text-sm sm:text-lg font-medium tracking-tight truncate">Headhunter de Bolso</span>
      </Link>
      <nav className="flex items-center gap-1 sm:gap-3 shrink-0">
        {user ? (
          <>
            <Button variant="ghost" size="sm" className="sm:h-10 sm:px-4" onClick={() => navigate("/perfil")}>Perfil</Button>
            <Button variant="outline" size="sm" className="sm:h-10 sm:px-4" onClick={handleLogout}>Sair</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="sm:h-10 sm:px-4" onClick={() => navigate("/auth")}>Entrar</Button>
            <Button variant="hero" size="sm" className="sm:h-10 sm:px-4" onClick={() => navigate("/auth?mode=signup")}>Começar</Button>
          </>
        )}
      </nav>
    </header>
  );
};
