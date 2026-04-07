import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import buyerlyLogo from "@/assets/buyerly-logo.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-ambient bg-card min-h-[600px]">
        {/* Left - Branding */}
        <div className="w-1/2 bg-inverse-surface text-inverse-on-surface p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(213,63%,11%)] via-[hsl(213,33%,20%)] to-[hsl(156,100%,21%,0.3)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-20">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-container-foreground" />
              </div>
              <span className="text-xl font-headline font-bold">Ray Funnel</span>
            </div>
            <h2 className="text-4xl font-headline font-bold leading-tight mb-6">
              Master your{" "}
              <span className="text-primary-container">growth engine</span> with precision.
            </h2>
            <p className="text-inverse-on-surface/70 text-base leading-relaxed">
              Join over 2,500+ high-growth teams using Ray Funnel to track, analyze, and optimize every stage of their buyer journey.
            </p>
          </div>
          <div className="relative z-10 glass-panel rounded-xl p-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary-container/30 border-2 border-inverse-surface" />
              <div className="w-8 h-8 rounded-full bg-tertiary-container/30 border-2 border-inverse-surface" />
              <div className="w-8 h-8 rounded-full bg-surface-variant/30 border-2 border-inverse-surface" />
            </div>
            <p className="text-sm">
              <strong>Active trackers</strong> currently monitoring 12.4M conversions.
            </p>
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-headline font-bold text-foreground mb-2">
            {isSignUp ? "Create account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignUp
              ? "Start tracking your buyer funnel today."
              : "Enter your credentials to access your dashboard."}
          </p>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 border border-outline-variant/30 rounded-xl py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors mb-6">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-outline-variant/20" />
            <span className="text-xs font-label uppercase tracking-widest text-muted-foreground">Or continue with email</span>
            <div className="flex-1 h-px bg-outline-variant/20" />
          </div>

          {isSignUp && (
            <div className="mb-4">
              <label className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-1.5 block">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-shadow" />
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs font-label uppercase tracking-wider text-muted-foreground mb-1.5 block">Email Address</label>
            <input type="email" placeholder="name@company.com" className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-shadow" />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-label uppercase tracking-wider text-muted-foreground">Password</label>
              {!isSignUp && (
                <button className="text-xs text-primary font-semibold hover:underline">Forgot password?</button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-shadow pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="w-full gradient-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity text-center block"
          >
            {isSignUp ? "Create Account" : "Sign in to Ray Funnel"}
          </Link>

          <p className="text-sm text-center text-muted-foreground mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-foreground font-semibold underline underline-offset-2"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>

      {/* System status */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-primary-container" />
        System Status: All systems operational
      </div>
    </div>
  );
}
