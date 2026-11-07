import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Bot,
  FileText,
  Smartphone,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Supportly<span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven WhatsApp Customer Support for Modern SaaS</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]">
            Supercharge customer support on{' '}
            <span className="text-indigo-600 dark:text-indigo-400">WhatsApp</span> with tailored AI Agents.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Ingest your refund policies, FAQs, and documentation PDFs. SupportlyAI automatically resolves customer queries over WhatsApp 24/7 with strict grounding.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 font-medium px-7 shadow-sm">
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium px-7">
                Sign in to Dashboard
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Spring Boot Production Backend</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-indigo-500" />
              <span>JWT Authenticated Sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-amber-500" />
              <span>Twilio Webhook Ready</span>
            </div>
          </div>
        </div>

        {/* Product Preview Card */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-14">
          <div className="relative rounded-2xl border border-border/80 bg-card p-3 sm:p-5 shadow-elevated">
            <div className="flex items-center space-x-2 pb-3 border-b border-border/50">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-muted-foreground ml-2 font-mono">supportly.dashboard/preview</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
              {/* Card 1 */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  <Bot className="h-4 w-4" />
                  <span>Configured AI Agent</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">Customer Support Agent</h4>
                <p className="text-xs text-muted-foreground mt-1">Grounds answers directly in uploaded PDFs.</p>
                <div className="mt-3 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Indexed Knowledge</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">refund-policy.pdf</h4>
                <p className="text-xs text-muted-foreground mt-1">Vector embeddings prepared for RAG queries.</p>
                <div className="mt-3 text-[11px] text-muted-foreground font-mono">
                  Indexed via Spring Boot
                </div>
              </div>

              {/* Card 3 */}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  <Smartphone className="h-4 w-4" />
                  <span>WhatsApp Delivery</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">Twilio Server Webhook</h4>
                <p className="text-xs text-muted-foreground mt-1">Secure endpoint handles incoming chat events.</p>
                <div className="mt-3 text-[11px] text-muted-foreground">
                  Webhook /api/whatsapp/webhook
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              How SupportlyAI Works
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Deploy intelligent WhatsApp customer support grounded in your business knowledge in three simple steps.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-semibold text-foreground">Create your AI Agent</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Register your business and provision specialized customer support agents via the centralized dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-semibold text-foreground">Upload Knowledge PDFs</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Drop your FAQ documents, policies, or product catalogs. Our Spring Boot backend chunks and indexes them for precise AI retrieval.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-semibold text-foreground">Connect WhatsApp</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Point your Twilio WhatsApp webhook to the backend webhook. Customers receive instant, verified answers anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Engineered for Precision and Scale
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Built on battle-tested architecture designed for enterprise reliability and privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border p-5 bg-card">
              <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-3">
                <Zap className="h-4 w-4" />
              </div>
              <h4 className="font-semibold text-sm text-foreground">Real-time Spring Boot REST</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Direct integration with your Spring Boot service at localhost:8080. Fast response times with centralized Axios clients.
              </p>
            </div>

            <div className="rounded-xl border border-border p-5 bg-card">
              <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-3">
                <FileText className="h-4 w-4" />
              </div>
              <h4 className="font-semibold text-sm text-foreground">Multipart PDF Ingestion</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Client-side type verification with live progress indicators. Files are sent directly via verified multipart endpoints.
              </p>
            </div>

            <div className="rounded-xl border border-border p-5 bg-card">
              <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-3">
                <Shield className="h-4 w-4" />
              </div>
              <h4 className="font-semibold text-sm text-foreground">Zero Frontend Secret Exposure</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Twilio credentials and Groq API keys remain strictly server-side. Frontend only handles authenticated JWT tokens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-border/60 bg-muted/10 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="font-semibold text-foreground">SupportlyAI</span>
            <span>&copy; {new Date().getFullYear()} Supportly Inc. All rights reserved.</span>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link to="/login" className="hover:text-foreground">Log In</Link>
            <Link to="/signup" className="hover:text-foreground">Create Account</Link>
            <span className="text-muted-foreground/60">Vite + React + Spring Boot</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
