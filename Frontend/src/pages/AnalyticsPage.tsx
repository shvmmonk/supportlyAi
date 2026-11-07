import React from 'react';
import { BarChart3, Clock, LineChart, PieChart, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Analytics & Telemetry
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Performance metrics, response latency, resolution rates, and knowledge base coverage.
        </p>
      </div>

      {/* Clearly marked Coming Soon Empty State */}
      <Card className="border-dashed border-border bg-card/60">
        <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="relative mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-8 ring-indigo-500/5">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-indigo-600 p-1 text-white shadow">
              <Sparkles className="h-3 w-3" />
            </div>
          </div>

          <div className="inline-flex items-center space-x-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            <Clock className="h-3 w-3" />
            <span>Feature in Development &bull; Coming Soon</span>
          </div>

          <h3 className="text-xl font-bold text-foreground">
            Support Telemetry & Reporting Engine
          </h3>

          <p className="mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
            In compliance with our verified API specifications, SupportlyAI does not present synthetic or mock metrics. Ingestion metrics and resolution rate analytics will activate once the backend analytics service is integrated.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full text-left">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1.5">
                <LineChart className="h-4 w-4" />
                <p className="text-xs font-semibold text-foreground">Resolution Rate</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Percentage of WhatsApp questions resolved entirely by PDF-grounded AI without human escalation.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1.5">
                <Clock className="h-4 w-4" />
                <p className="text-xs font-semibold text-foreground">Token & LLM Latency</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Live monitoring of Groq inference speed and vector retrieval latency per message.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1.5">
                <PieChart className="h-4 w-4" />
                <p className="text-xs font-semibold text-foreground">FAQ Gaps</p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Automated detection of customer queries missing corresponding answers in uploaded PDFs.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center space-x-3">
            <Link to="/dashboard">
              <Button size="sm" variant="outline" className="text-xs">
                Back to Dashboard
              </Button>
            </Link>
            <Link to="/dashboard/agents">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs">
                Inspect AI Agents
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
