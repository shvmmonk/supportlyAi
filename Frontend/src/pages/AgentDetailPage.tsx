import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bot,
  Calendar,
  FileText,
  Upload,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Info,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { agentsApi } from '@/api/agents';
import { faqsApi } from '@/api/faqs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, getStatusVariant } from '@/lib/utils';
import { toast } from 'sonner';

export const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const agentId = Number(id);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Fetch agents list to identify selected agent (as specified in prompt: "Use the fetched agents list to identify selected agent")
  const {
    data: agents = [],
    isLoading: isAgentsLoading,
    isError: isAgentsError,
    error: agentsError,
  } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.getAgents,
  });

  const selectedAgent = agents.find((a) => a.id === agentId);

  // Fetch FAQs for this agent
  const {
    data: faqs = [],
    isLoading: isFaqsLoading,
    isError: isFaqsError,
    error: faqsError,
    refetch: refetchFaqs,
  } = useQuery({
    queryKey: ['faqs', agentId],
    queryFn: () => faqsApi.getFaqs(agentId),
    enabled: !isNaN(agentId) && agentId > 0,
  });

  // Upload FAQ Mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      faqsApi.uploadFaq(agentId, file, (progress) => {
        setUploadProgress(progress);
      }),
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ['faqs', agentId] });
      toast.success(`Uploaded "${newDoc.fileName}" successfully!`);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (err: any) => {
      toast.error('Upload failed', {
        description: err.message || 'Error uploading document to backend',
      });
      setUploadProgress(null);
    },
  });

  const handleValidateAndUpload = (file: File) => {
    // Client-side PDF validation
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      toast.error('Invalid file type', {
        description: 'Only PDF documents are accepted by the FAQ knowledge base.',
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'PDF file size must be under 25MB.',
      });
      return;
    }

    uploadMutation.mutate({ file });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleValidateAndUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleValidateAndUpload(file);
    }
  };

  if (isAgentsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isAgentsError || !selectedAgent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-rose-500/10 p-3 text-rose-500 mb-3">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Agent Not Found</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          {agentsError
            ? (agentsError as Error).message
            : `Could not locate agent with ID #${agentId} in your registered agents.`}
        </p>
        <Link to="/dashboard/agents" className="mt-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Agents
          </Button>
        </Link>
      </div>
    );
  }

  const statusMeta = getStatusVariant(selectedAgent.status);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Link to="/dashboard/agents" className="hover:text-foreground flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          AI Agents
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{selectedAgent.name}</span>
      </div>

      {/* Agent Header Card */}
      <Card className="overflow-hidden border-border bg-card shadow-card">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-500/10">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {selectedAgent.name}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMeta.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${statusMeta.dotClass}`} />
                    {statusMeta.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                  <span>Agent ID: #{selectedAgent.id}</span>
                  <span>&bull;</span>
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    Created {formatDate(selectedAgent.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Backend constraint badge: No edit/delete endpoints exist */}
            <div className="flex items-center space-x-2">
              <span className="rounded-lg bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-border">
                Spring Boot REST Agent
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Knowledge Base & FAQs Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1-col: Upload Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Knowledge PDF</CardTitle>
              <CardDescription>
                Upload FAQs, refund rules, or terms as PDF. Grounded AI models will retrieve answers from these files.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-500/5'
                    : 'border-border/80 hover:border-indigo-500/50 hover:bg-muted/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadMutation.isPending}
                />
                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {uploadMutation.isPending ? 'Uploading document...' : 'Click to upload or drag & drop'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  PDF format only (Max 25MB)
                </p>
              </div>

              {/* Progress indicator */}
              {uploadMutation.isPending && (
                <div className="space-y-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3">
                  <div className="flex justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    <span>Uploading to Spring Boot...</span>
                    <span>{uploadProgress || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-950">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-150"
                      style={{ width: `${uploadProgress || 10}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center space-x-1.5 font-medium text-foreground/80">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Multipart Verified Endpoint</span>
                </div>
                <p>
                  Dispatches <code className="text-foreground font-mono">POST /api/agents/{agentId}/faqs</code> with multipart key <code className="text-foreground font-mono">file</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 2-cols: Uploaded Documents Table/List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Grounding Documents ({faqs.length})</CardTitle>
                <CardDescription>
                  Documents ingested and available to {selectedAgent.name} during WhatsApp interactions.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchFaqs()}
                className="text-xs"
              >
                Refresh
              </Button>
            </CardHeader>

            <CardContent>
              {/* Important backend notice: Deletion not supported */}
              <div className="mb-4 flex items-center space-x-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
                <Info className="h-4 w-4 shrink-0" />
                <span>
                  The backend provides viewing and uploading endpoints for agent FAQs. File removal is not supported by current API contracts.
                </span>
              </div>

              {isFaqsError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-600 dark:text-rose-400">
                  <p className="font-semibold">Unable to fetch FAQ documents</p>
                  <p className="mt-1">{(faqsError as Error)?.message || 'Backend connection error'}</p>
                </div>
              )}

              {isFaqsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              ) : faqs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-xl p-6">
                  <FileText className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <h4 className="text-sm font-semibold text-foreground">No documents uploaded yet</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Upload your first PDF document to enable knowledge retrieval for this agent.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {faqs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <FileCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {doc.fileName}
                          </p>
                          <div className="flex items-center space-x-2 text-[11px] text-muted-foreground mt-0.5">
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              Uploaded {formatDate(doc.uploadedAt)}
                            </span>
                            <span>&bull;</span>
                            <span>Doc ID #{doc.id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Ingested
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
