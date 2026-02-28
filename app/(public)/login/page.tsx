"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginFormValues,
} from "@/modules/auth/types/auth.schemas";
import { useLogin } from "@/modules/auth/hooks/useAuth";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const { login, isLoading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "ada@aiplatform.dev",
      password: "password123",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data.email, data.password);
  };

  return (
    <div className="login-root">
      {/* Animated grid background */}
      <div className="grid-bg" aria-hidden="true" />
      <div className="glow-orb orb-1" aria-hidden="true" />
      <div className="glow-orb orb-2" aria-hidden="true" />

      <main className="login-container">
        {/* Logo / Brand */}
        <div className="brand">
          <div className="brand-icon">
            <Zap size={22} strokeWidth={2.5} />
          </div>
          <span className="brand-name">
            NEXUS<span className="brand-accent">AI</span>
          </span>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h1 className="card-title">Access Terminal</h1>
            <p className="card-subtitle">
              Authenticate to manage your agent fleet
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="login-form"
          >
            <div className="field-group">
              <label htmlFor="email" className="field-label">
                Operator Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`field-input ${errors.email ? "field-input--error" : ""}`}
                placeholder="operator@domain.dev"
                {...register("email")}
              />
              {errors.email && (
                <span className="field-error" role="alert">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="field-group">
              <label htmlFor="password" className="field-label">
                Access Key
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`field-input field-input--with-icon ${errors.password ? "field-input--error" : ""}`}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="field-error" role="alert">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner" aria-hidden="true" />
                  Authenticating...
                </span>
              ) : (
                "Initialize Session"
              )}
            </button>
          </form>

          <p className="demo-hint">Demo credentials are pre-filled above.</p>
        </div>

        <p className="footer-text">
          NEXUS AI Platform &copy; {new Date().getFullYear()} &mdash; Restricted
          Access
        </p>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        .login-root {
          min-height: 100vh;
          background: #050810;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Animated grid */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(56, 189, 248, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridScroll 20s linear infinite;
        }
        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(48px); }
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
          top: -100px; left: -100px;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 70%);
          bottom: -80px; right: -80px;
          animation: orbFloat 10s ease-in-out infinite reverse;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }

        .login-container {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
          max-width: 420px;
          padding: 1.5rem;
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Brand */
        .brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .brand-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #38bdf8);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .brand-name {
          font-family: 'Space Mono', monospace;
          font-size: 1.3rem;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: 3px;
        }
        .brand-accent { color: #38bdf8; }

        /* Card */
        .login-card {
          width: 100%;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 16px;
          padding: 2.2rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.05), 0 24px 48px rgba(0, 0, 0, 0.4);
        }

        .card-header { margin-bottom: 1.8rem; }
        .card-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #f1f5f9;
          margin: 0 0 0.3rem;
          letter-spacing: -0.3px;
        }
        .card-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          font-family: 'Space Mono', monospace;
        }

        /* Form */
        .login-form { display: flex; flex-direction: column; gap: 1.2rem; }

        .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .input-wrapper { position: relative; }

        .field-input {
          width: 100%;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.6);
          border-radius: 8px;
          padding: 0.7rem 0.9rem;
          color: #e2e8f0;
          font-size: 0.9rem;
          font-family: 'Space Mono', monospace;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #475569; }
        .field-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .field-input--error {
          border-color: #f87171 !important;
          box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1) !important;
        }
        .field-input--with-icon { padding-right: 2.8rem; }

        .input-icon-btn {
          position: absolute;
          right: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .input-icon-btn:hover { color: #94a3b8; }
        .input-icon-btn:focus-visible {
          outline: 2px solid #6366f1;
          border-radius: 4px;
        }

        .field-error {
          font-size: 0.78rem;
          color: #f87171;
          font-family: 'Space Mono', monospace;
        }

        .submit-btn {
          width: 100%;
          margin-top: 0.4rem;
          padding: 0.8rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          border-radius: 8px;
          color: white;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(99, 102, 241, 0.45);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
        }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .demo-hint {
          margin-top: 1.2rem;
          text-align: center;
          font-size: 0.75rem;
          font-family: 'Space Mono', monospace;
          color: #334155;
        }

        .footer-text {
          font-size: 0.7rem;
          font-family: 'Space Mono', monospace;
          color: #1e293b;
          text-align: center;
          letter-spacing: 0.5px;
        }

        @media (max-width: 480px) {
          .login-card { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
