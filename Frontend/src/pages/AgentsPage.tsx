import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Bot,
  Plus,
  Search,
  Calendar,
  ArrowRight,
  FileText,
  AlertCircle,
  Info,
} from 'lucide-react';
import { agentsApi } from '@/api/agents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate, getStatusVariant } from '@/lib/utils';
import { toast } from 'sonner';

const createAgentSchema = z.object({
  name: z
    .string()
    .min(2, 'Agent name must be at least 2 characters')
    .max(60, 'Agent name must be under 60 characters'),
});

type CreateAgentFormValues = z.infer<typeof createAgentSchema>;

export const AgentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFilter = searchParams.get('search') || '';

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchFilter);

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: agentsApi.createAgent,
    onSuccess: (newAgent) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast.success(`Agent "${newAgent.name}" created successfully!`);
      reset();
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      toast.error('Failed to create agent', {
        description: err.message || 'Please check backend logs',
      });
    },
  });

  const onSubmit = (values: CreateAgentFormValues) => {
    createMutation.mutate({ name: values.name.trim() });
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (val.trim()) {
      setSearchParams({ search: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const filteredAgents = agents.filter((agent) =>
    (agent.name || '').toLowerCase().includes(searchInput.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            AI Support Agents
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Provision and manage autonomous agents grounded on your company knowledge bases.
          </p>
        </div>

        <Button
          onClick={() => {
            reset();
            setIsDialogOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 shadow-sm"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create New Agent
        </Button>
      </div>

      {/* Backend Capability Banner */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-muted-foreground flex items-center space-x-2.5">
        <Info className="h-4 w-4 text-indigo-500 shrink-0" />
        <div>
          <span className="font-semibold text-foreground">API Contracts Active:</span> Supports creation via{' '}
          <code className="text-foreground font-mono">POST /api/agents</code> and listing via{' '}
          <code className="text-foreground font-mono">GET /api/agents</code>. In accordance with current backend endpoints, editing and deletion are disabled until future API releases.
        </div>
      </div>

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Filter agents by name..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="text-xs text-muted-foreground self-start sm:self-auto font-medium">
          Showing {filteredAgents.length} of {agents.length} agent(s)
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Failed to fetch agents</p>
              <p className="text-xs mt-1 text-rose-500/90 leading-relaxed">
                {(error as Error)?.message || 'Make sure http://localhost:8080 is accessible.'}
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="shrink-0 text-xs">
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-2 border-t border-border/60">
                <Skeleton className="h-8 w-full rounded" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && agents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card">
          <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-600 dark:text-indigo-400 mb-4 ring-8 ring-indigo-500/5">
            <Bot className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No agents provisioned</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
            Get started by creating your first AI Support Agent. You will be able to attach PDF knowledge bases to ground its responses.
          </p>
          <Button
            onClick={() => {
              reset();
              setIsDialogOpen(true);
            }}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Create First Agent
          </Button>
        </div>
      )}

      {/* Filtered Empty State */}
      {!isLoading && !isError && agents.length > 0 && filteredAgents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border p-8 text-center bg-card">
          <Search className="h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="text-sm font-semibold text-foreground">No matching agents found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            No agents found matching &ldquo;{searchInput}&rdquo;.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSearchChange('')}
            className="mt-3 text-xs"
          >
            Clear Filter
          </Button>
        </div>
      )}

      {/* Agents Cards Grid */}
      {!isLoading && !isError && filteredAgents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => {
            const statusMeta = getStatusVariant(agent.status);

            return (
              <Card
                key={agent.id}
                className="group flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-card transition-all"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/10">
                      <Bot className="h-5 w-5" />
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMeta.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${statusMeta.dotClass}`} />
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="mt-4">
                    <CardTitle className="text-base font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {agent.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Agent ID #{agent.id}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 flex-1">
                  <div className="space-y-2 mt-2 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>Created {formatDate(agent.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>Dedicated Knowledge Base supported</span>
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 pt-0">
                  <Link to={`/dashboard/agents/${agent.id}`} className="w-full block">
                    <Button
                      variant="outline"
                      className="w-full text-xs font-medium justify-between group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:border-indigo-500/30 transition-colors"
                    >
                      <span>Manage Agent & FAQs</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Agent Accessible Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create AI Support Agent</DialogTitle>
            <DialogDescription>
              Provision a new customer support agent. You will be able to attach PDF knowledge bases to ground its responses.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                placeholder="e.g. Customer Support Agent, Returns Specialist"
                error={!!errors.name}
                disabled={createMutation.isPending}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
              <p className="font-medium text-foreground/80">API Contract Details</p>
              <p>Will send payload <code className="text-foreground font-mono">&#123; "name": "..." &#125;</code> to <code className="text-foreground font-mono">POST /api/agents</code> with Bearer JWT.</p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500"
                isLoading={createMutation.isPending}
              >
                Create Agent
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
