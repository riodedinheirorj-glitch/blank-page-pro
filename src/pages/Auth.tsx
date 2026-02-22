import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, MapPin } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type AuthMode = "login" | "signup" | "forgot";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/", { replace: true });
      }
      setCheckingSession(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/", { replace: true });
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Verifique seu e-mail para confirmar o cadastro!");
      setMode("login");
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!email) {
      toast.error("Digite seu e-mail");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Link de redefinição enviado para seu e-mail!");
      setMode("login");
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") handleLogin();
    else if (mode === "signup") handleSignup();
    else handleForgot();
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 40%, #1b2838 100%)" }}>
      {/* Animated orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 animate-pulse" style={{ background: "radial-gradient(circle, #2F80ED 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15 animate-pulse" style={{ background: "radial-gradient(circle, #7B61FF 0%, transparent 70%)", filter: "blur(80px)", animationDelay: "1s" }} />
      <div className="absolute top-[50%] left-[60%] w-[250px] h-[250px] rounded-full opacity-10 animate-pulse" style={{ background: "radial-gradient(circle, #00D4AA 0%, transparent 70%)", filter: "blur(60px)", animationDelay: "2s" }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: "linear-gradient(135deg, #2F80ED, #7B61FF)" }}>
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Rota<span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #2F80ED, #7B61FF)" }}>Smart</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Otimize suas rotas com inteligência</p>
        </div>

        {/* Glass card */}
        <div className="rounded-3xl p-8 backdrop-blur-xl border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" }}>
          {/* Mode tabs */}
          {mode !== "forgot" && (
            <div className="flex mb-8 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)" }}>
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300"
                  style={{
                    background: mode === m ? "linear-gradient(135deg, #2F80ED, #7B61FF)" : "transparent",
                    color: mode === m ? "#fff" : "rgba(255,255,255,0.5)",
                    boxShadow: mode === m ? "0 4px 16px rgba(47,128,237,0.35)" : "none",
                  }}
                >
                  {m === "login" ? "Entrar" : "Criar conta"}
                </button>
              ))}
            </div>
          )}

          {mode === "forgot" && (
            <div className="mb-6">
              <button onClick={() => setMode("login")} className="text-sm text-gray-400 hover:text-white transition-colors">
                ← Voltar ao login
              </button>
              <h2 className="text-xl font-semibold text-white mt-3">Redefinir senha</h2>
              <p className="text-gray-400 text-sm mt-1">Enviaremos um link para seu e-mail</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:ring-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(47,128,237,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(47,128,237,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(47,128,237,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(47,128,237,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {mode !== "forgot" && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(47,128,237,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(47,128,237,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-gray-400 hover:text-blue-400 transition-colors">
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: "linear-gradient(135deg, #2F80ED, #7B61FF)", boxShadow: "0 4px 24px rgba(47,128,237,0.4)" }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "login" && "Entrar"}
                  {mode === "signup" && "Criar conta"}
                  {mode === "forgot" && "Enviar link"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          © {new Date().getFullYear()} RotaSmart. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Auth;
