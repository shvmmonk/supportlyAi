import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Bot,
  FileText,
  Smartphone,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { agentsApi } from '@/api/agents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, getStatusVariant } from '@/lib/utils';

export const DashboardOverviewPage: React.FC = () => {
  const { session } = useAuth();

  const {
    data: agents = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.getAgents,
  });

  const activeAgentsCount = agents.filter(
    (a) => (a.status || '').toUpperCase() === 'ACTIVE'
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card to-muted/30 p-6 sm:p-8 shadow-card">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SupportlyAI Production Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {session?.businessName || 'Business Owner'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Your WhatsApp AI customer support hub is active. Ground your agents with PDF knowledge bases and point your Twilio webhook for automated query resolution.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard/agents">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                <Plus className="mr-1.5 h-4 w-4" />
                Manage AI Agents
              </Button>
            </Link>
            <Link to="/dashboard/knowledge-base">
              <Button size="sm" variant="outline">
                <FileText className="mr-1.5 h-4 w-4" />
                Knowledge Base
              </Button>
            </Link>
            <Link to="/dashboard/whatsapp">
              <Button size="sm" variant="outline">
                <Smartphone className="mr-1.5 h-4 w-4" />
                WhatsApp Webhook Setup
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row: Real Agent Data + Explicit Unsupported Placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Real: Total Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Agents
            </CardTitle>
            <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : isError ? (
              <span className="text-sm text-rose-500 font-medium">Error</span>
            ) : (
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {agents.length}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center space-x-1">
              <span>Fetched live from</span>
              <code className="text-foreground font-mono">GET /api/agents</code>
            </p>
          </CardContent>
        </Card>

        {/* Real: Active Status Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Agents
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {activeAgentsCount}
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-1">
              {agents.length > 0
                ? `${Math.round((activeAgentsCount / agents.length) * 100)}% active status`
                : 'No agents registered yet'}
            </p>
          </CardContent>
        </Card>

        {/* Clearly marked Unsupported Placeholder: WhatsApp Messages */}
        <Card className="border-dashed bg-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-muted-foreground/60">—</span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Message logging endpoint pending backend release
            </p>
          </CardContent>
        </Card>

        {/* Clearly marked Unsupported Placeholder: Avg Resolution */}
        <Card className="border-dashed bg-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Avg Resolution
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-muted-foreground/60">—</span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Latency telemetry planned for analytics module
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Backend Error Banner if API is down */}
      {isError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to fetch agents from backend</p>
              <p className="text-xs mt-1 text-rose-500/90 leading-relaxed">
                {(error as Error)?.message || 'Make sure the Spring Boot server is running on http://localhost:8080'}
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="shrink-0 text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Quick Setup Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supportly Setup Checklist</CardTitle>
          <CardDescription>
            Complete these steps to activate automated WhatsApp customer support for {session?.businessName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3 p-3.5 rounded-lg border border-border bg-card">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  agents.length > 0
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {agents.length > 0 ? '✓' : '1'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">1. Create AI Agent</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {agents.length > 0
                    ? `${agents.length} agent(s) provisioned`
                    : 'Provision your first support agent'}
                </p>
                {agents.length === 0 && (
                  <Link
                    to="/dashboard/agents"
                    className="inline-flex items-center text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-1.5"
                  >
                    Create now <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-lg border border-border bg-card">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-[11px] font-bold">
                2
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">2. Upload Knowledge PDF</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Attach refund policies and FAQs to your agent
                </p>
                <Link
                  to="/dashboard/knowledge-base"
                  className="inline-flex items-center text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-1.5"
                >
                  Upload documents <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-lg border border-border bg-card">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-[11px] font-bold">
                3
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">3. Connect WhatsApp</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Point Twilio webhook to Spring Boot server
                </p>
                <Link
                  to="/dashboard/whatsapp"
                  className="inline-flex items-center text-[11px] text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-1.5"
                >
                  View webhook URL <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agents Overview List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Configured Agents</CardTitle>
            <CardDescription>
              AI agents configured to respond to WhatsApp customer inquiries.
            </CardDescription>
          </div>
          <Link to="/dashboard/agents">
            <Button variant="outline" size="sm" className="text-xs">
              View All ({agents.length})
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          ) : agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-xl p-6">
              <div className="rounded-full bg-indigo-500/10 p-3 text-indigo-600 mb-3">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">No agents created yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Create your first agent to begin uploading policy documents and handling WhatsApp messages.
              </p>
              <Link to="/dashboard/agents" className="mt-4">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Create Agent
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {agents.slice(0, 5).map((agent) => {
                const statusMeta = getStatusVariant(agent.status);
                return (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {agent.name}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusMeta.badgeClass}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${statusMeta.dotClass}`} />
                            {statusMeta.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Created {formatDate(agent.createdAt)} &bull; Agent ID #{agent.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link to={`/dashboard/agents/${agent.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs h-8">
                          Manage FAQs
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
