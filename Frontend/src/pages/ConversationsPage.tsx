import React from 'react';
import { MessageSquare, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const ConversationsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Conversations
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time WhatsApp customer session monitoring and human agent escalation.
        </p>
      </div>

      {/* Clearly marked Coming Soon Empty State */}
      <Card className="border-dashed border-border bg-card/60">
        <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="relative mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-8 ring-indigo-500/5">
              <MessageSquare className="h-8 w-8" />
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
            WhatsApp Live Chat History
          </h3>

          <p className="mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed">
            The Spring Boot backend currently executes server-to-server webhook ingestion. Endpoints for persisting and querying customer conversation threads, sentiment tracking, and live agent handoffs will be exposed in an upcoming release.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full text-left">
            <div className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-xs font-semibold text-foreground">Live Message Log</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Inspect customer queries and grounded AI responses in real-time.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-xs font-semibold text-foreground">Human Takeover</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Seamlessly pause the AI agent and chat directly with WhatsApp users.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-3.5">
              <p className="text-xs font-semibold text-foreground">Sentiment Analytics</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Automatic customer satisfaction scoring and issue classification.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center space-x-3">
            <Link to="/dashboard/agents">
              <Button size="sm" variant="outline" className="text-xs">
                Manage AI Agents
              </Button>
            </Link>
            <Link to="/dashboard/knowledge-base">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs">
                View Knowledge Base
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
