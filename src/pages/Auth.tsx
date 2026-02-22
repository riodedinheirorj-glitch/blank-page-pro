import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, MapPin, Loader2 } from "lucide-react";
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
      if (session) navigate("/", { replace: true });
      setCheckingSession(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/", { replace: true });
      setCheckingSession(false);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message);
    setLoading(false);
  };

  const handleSignup = async () => {
    if (password.length < 6) { toast.error("A senha deve ter pelo menos 6 caracteres"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
    });
    if (error) toast.error(error.message);
    else { toast.success("Verifique seu e-mail para confirmar o cadastro!"); setMode("login"); }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!email) { toast.error("Digite seu e-mail"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else { toast.success("Link de redefinição enviado para seu e-mail!"); setMode("login"); }
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #EAF2FF 0%, #FFFFFF 100%)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#2563EB" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(180deg, #EAF2FF 0%, #FFFFFF 100%)" }}>
      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{ opacity: 0.03, backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="relative z-10 w-full" style={{ maxWidth: 420 }}>
        {/* Card */}
        <div className="bg-white p-8" style={{ borderRadius: 24, boxShadow: "0px 20px 40px rgba(37, 99, 235, 0.15)" }}>
          {/* Logo + Title */}
          <div className="flex items-center gap-3 justify-center mb-2">
            <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: "#2563EB" }}>
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-semibold text-xl" style={{ color: "#111827" }}>Rotasmart</span>
              <span className="block text-sm" style={{ color: "#6B7280", fontWeight: 400 }}>Motorista</span>
            </div>
          </div>

          <p className="text-center mb-6 text-sm" style={{ color: "#6B7280" }}>
            Acesse sua conta ou crie um novo cadastro para iniciar a navegação.
          </p>

          {/* Tabs */}
          {mode !== "forgot" && (
            <div className="flex p-1 mb-6" style={{ background: "#F3F4F6", borderRadius: 999 }}>
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className="flex-1 py-2 text-sm font-semibold transition-all duration-200"
                  style={{
                    borderRadius: 999,
                    background: mode === m ? "#FFFFFF" : "transparent",
                    color: mode === m ? "#2563EB" : "#6B7280",
                    boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    fontWeight: mode === m ? 600 : 400,
                  }}
                >
                  {m === "login" ? "Entrar" : "Cadastrar"}
                </button>
              ))}
            </div>
          )}

          {mode === "forgot" && (
            <div className="mb-6">
              <button type="button" onClick={() => setMode("login")} className="text-sm transition-colors" style={{ color: "#2563EB" }}>
                ← Voltar ao login
              </button>
              <h2 className="text-lg font-semibold mt-2" style={{ color: "#111827" }}>Redefinir senha</h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>Enviaremos um link para seu e-mail</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block mb-1.5" style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Nome completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 text-sm outline-none transition-all duration-200"
                    style={{ height: 48, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 14 }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.2)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1.5" style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 text-sm outline-none transition-all duration-200"
                  style={{ height: 48, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 14 }}
                  onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.2)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Senha</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="transition-all duration-200 hover:underline"
                      style={{ fontSize: 13, color: "#2563EB", textDecoration: "none" }}
                    >
                      Esqueceu sua senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-12 text-sm outline-none transition-all duration-200"
                    style={{ height: 48, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 14 }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.2)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "#9CA3AF" }}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                boxShadow: "0px 8px 20px rgba(37, 99, 235, 0.35)",
                fontSize: 16,
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.08)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.filter = "brightness(1)"; }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === "login" && "Entrar"}
                  {mode === "signup" && "Criar conta"}
                  {mode === "forgot" && "Enviar link"}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#9CA3AF" }}>
          © {new Date().getFullYear()} Rotasmart Motorista. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Auth;
