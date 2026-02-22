import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, MapPin, Loader2 } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #dbeafe 0%, #eff6ff 30%, #ffffff 100%)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#2563EB" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start overflow-auto" style={{ background: "linear-gradient(180deg, #dbeafe 0%, #eff6ff 40%, #ffffff 100%)" }}>
      {/* Tech grid texture */}
      <div className="fixed inset-0 pointer-events-none" style={{ opacity: 0.04, backgroundImage: "linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      {/* Subtle light rays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20" style={{ background: "radial-gradient(ellipse at center, rgba(147,197,253,0.5) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center pt-12 pb-8 px-4" style={{ maxWidth: 440 }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          {/* Pin icon with gradient ring */}
          <div className="relative">
            <div className="flex items-center justify-center" style={{ width: 56, height: 56 }}>
              {/* Outer gradient ring */}
              <div className="absolute inset-0 rounded-full" style={{
                background: "conic-gradient(from 180deg, #818cf8, #3b82f6, #06b6d4, #3b82f6, #818cf8)",
                opacity: 0.6,
              }} />
              <div className="absolute rounded-full" style={{ inset: 3, background: "linear-gradient(180deg, #eff6ff, #ffffff)" }} />
              <MapPin className="relative z-10" style={{ width: 28, height: 28, color: "#7c3aed" }} />
            </div>
          </div>
          <div>
            <div className="font-bold text-2xl" style={{ color: "#1e40af", letterSpacing: "-0.5px" }}>Rotasmart</div>
            <div className="text-base" style={{ color: "#7c3aed", fontWeight: 500, marginTop: -2 }}>Motorista</div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-center mb-6" style={{ color: "#4b5563", fontSize: 16, lineHeight: 1.5 }}>
          Bem-vindo! Acesse sua conta ou<br />crie uma conta gratuita.
        </p>

        {/* Decorative map illustration */}
        <div className="relative w-full flex justify-center mb-6" style={{ height: 180 }}>
          {/* Stylized map base */}
          <div className="absolute" style={{
            width: 280, height: 160,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(219,234,254,0.6), rgba(191,219,254,0.3))",
            borderRadius: 16,
            transform: "perspective(600px) rotateX(45deg) rotateZ(-5deg)",
            border: "1px solid rgba(147,197,253,0.3)",
          }}>
            {/* Grid lines on map */}
            <div className="absolute inset-0" style={{
              opacity: 0.15,
              backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              borderRadius: 16,
            }} />
            {/* Road */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 160" style={{ borderRadius: 16 }}>
              <path d="M 0 120 Q 70 100 140 80 T 280 40" stroke="#3b82f6" strokeWidth="8" fill="none" opacity="0.3" strokeLinecap="round" />
              <path d="M 0 120 Q 70 100 140 80 T 280 40" stroke="#60a5fa" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
            </svg>
          </div>
          {/* Pin 1 - large */}
          <div className="absolute" style={{ bottom: 80, left: "50%", marginLeft: 10, zIndex: 2 }}>
            <div className="flex flex-col items-center">
              <div className="rounded-full flex items-center justify-center" style={{ width: 36, height: 36, background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: "0 6px 20px rgba(37,99,235,0.4)" }}>
                <div className="rounded-full" style={{ width: 10, height: 10, background: "white" }} />
              </div>
              <div style={{ width: 3, height: 12, background: "linear-gradient(#2563eb, transparent)" }} />
            </div>
          </div>
          {/* Pin 2 - small */}
          <div className="absolute" style={{ bottom: 60, right: "25%", zIndex: 1 }}>
            <div className="flex flex-col items-center">
              <div className="rounded-full flex items-center justify-center" style={{ width: 24, height: 24, background: "linear-gradient(135deg, #60a5fa, #3b82f6)", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
                <div className="rounded-full" style={{ width: 7, height: 7, background: "white" }} />
              </div>
              <div style={{ width: 2, height: 8, background: "linear-gradient(#3b82f6, transparent)" }} />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white p-7" style={{ borderRadius: 24, boxShadow: "0px 16px 48px rgba(37, 99, 235, 0.12), 0 0 0 1px rgba(37,99,235,0.04)" }}>
          {mode === "forgot" && (
            <div className="mb-5">
              <button type="button" onClick={() => setMode("login")} className="text-sm font-medium transition-colors" style={{ color: "#2563EB" }}>
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
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 text-sm outline-none transition-all duration-200"
                  style={{ height: 48, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 14, color: "#111827" }}
                  onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Mail className="w-4 h-4" style={{ color: "#6B7280" }} />
                <label style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>E-mail</label>
              </div>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 text-sm outline-none transition-all duration-200"
                style={{ height: 48, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 14, color: "#111827" }}
                onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>Senha</label>
                  {mode === "login" && (
                    <button type="button" onClick={() => setMode("forgot")} className="hover:underline transition-all" style={{ fontSize: 13, color: "#2563EB", fontWeight: 500 }}>
                      Esqueceu sua senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 pr-12 text-sm outline-none transition-all duration-200"
                    style={{ height: 48, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, fontSize: 14, color: "#111827" }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563EB"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.15)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold transition-all duration-200 disabled:opacity-50 mt-2"
              style={{
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #06b6d4 100%)",
                boxShadow: "0px 8px 24px rgba(37, 99, 235, 0.35)",
                fontSize: 17,
                letterSpacing: 0.3,
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.05)"; }}}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.filter = "brightness(1)"; }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {mode === "login" && "Entrar"}
                  {mode === "signup" && "Criar conta"}
                  {mode === "forgot" && "Enviar link"}
                </>
              )}
            </button>
          </form>

          {mode === "login" && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
                <span className="text-xs" style={{ color: "#9CA3AF" }}>ou</span>
                <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
              </div>

              {/* Google button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 font-medium transition-all duration-200"
                style={{
                  height: 48,
                  borderRadius: 12,
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  fontSize: 15,
                  color: "#374151",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#F9FAFB"; }}
                onClick={() => toast.info("Login com Google será habilitado em breve")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar com Google
              </button>
            </>
          )}

          {/* Bottom link */}
          {mode === "login" && (
            <p className="text-center mt-5" style={{ fontSize: 14, color: "#6B7280" }}>
              Novo por aqui?{" "}
              <button type="button" onClick={() => setMode("signup")} className="font-semibold hover:underline" style={{ color: "#2563EB" }}>
                Criar conta gratuita
              </button>
            </p>
          )}

          {mode === "signup" && (
            <p className="text-center mt-5" style={{ fontSize: 14, color: "#6B7280" }}>
              Já tem conta?{" "}
              <button type="button" onClick={() => setMode("login")} className="font-semibold hover:underline" style={{ color: "#2563EB" }}>
                Fazer login
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#9CA3AF" }}>
          © {new Date().getFullYear()} Rotasmart Motorista
        </p>
      </div>
    </div>
  );
};

export default Auth;
