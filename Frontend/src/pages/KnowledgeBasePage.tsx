import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Upload,
  Bot,
  FileCheck,
  Clock,
  Info,
  ShieldCheck,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { agentsApi } from '@/api/agents';
import { faqsApi } from '@/api/faqs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export const KnowledgeBasePage: React.FC = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Fetch agents
  const {
    data: agents = [],
    isLoading: isAgentsLoading,
  } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsApi.getAgents,
  });

  // Auto-select first agent when list is loaded
  useEffect(() => {
    if (agents.length > 0 && selectedAgentId === null) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  // Fetch FAQs for selected agent
  const {
    data: faqs = [],
    isLoading: isFaqsLoading,
    isError: isFaqsError,
    error: faqsError,
    refetch: refetchFaqs,
  } = useQuery({
    queryKey: ['faqs', selectedAgentId],
    queryFn: () => faqsApi.getFaqs(selectedAgentId!),
    enabled: selectedAgentId !== null && selectedAgentId > 0,
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => {
      if (!selectedAgentId) throw new Error('Please select an agent first');
      return faqsApi.uploadFaq(selectedAgentId, file, (progress) => {
        setUploadProgress(progress);
      });
    },
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ['faqs', selectedAgentId] });
      toast.success(`Successfully uploaded "${newDoc.fileName}"!`);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (err: any) => {
      toast.error('Upload failed', {
        description: err.message || 'Failed to upload PDF knowledge file',
      });
      setUploadProgress(null);
    },
  });

  const handleValidateAndUpload = (file: File) => {
    if (!selectedAgentId) {
      toast.error('No agent selected', {
        description: 'Please select an agent to attach this knowledge base to.',
      });
      return;
    }

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      toast.error('Invalid document format', {
        description: 'Only PDF documents are accepted for vector indexing.',
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File exceeds limit', {
        description: 'Maximum PDF file size is 25MB.',
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

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Knowledge Base
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload PDF policies, refund guidelines, and FAQ sheets to ground WhatsApp AI answers.
          </p>
        </div>

        {/* Agent Selector Dropdown */}
        {agents.length > 0 && (
          <div className="flex items-center space-x-2.5">
            <label htmlFor="agent-select" className="text-xs font-medium text-muted-foreground">
              Active Agent:
            </label>
            <select
              id="agent-select"
              value={selectedAgentId ?? ''}
              onChange={(e) => setSelectedAgentId(Number(e.target.value))}
              className="h-9 rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} (#{agent.id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Backend API Notice */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-muted-foreground flex items-center space-x-2.5">
        <Info className="h-4 w-4 text-indigo-500 shrink-0" />
        <div>
          <span className="font-semibold text-foreground">Verified Ingestion Pipeline:</span> Direct multipart upload to{' '}
          <code className="text-foreground font-mono">POST /api/agents/&#123;agentId&#125;/faqs</code>. In accordance with existing backend specifications, deletion is disabled.
        </div>
      </div>

      {/* Agents Loading/Empty states */}
      {isAgentsLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      )}

      {!isAgentsLoading && agents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card">
          <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-600 dark:text-indigo-400 mb-4">
            <Bot className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Agents Available</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Knowledge base files are associated with specific agents. Please create an AI agent first.
          </p>
          <Link to="/dashboard/agents" className="mt-5">
            <Button className="bg-indigo-600 hover:bg-indigo-500">
              <Plus className="mr-1.5 h-4 w-4" />
              Go to Agents
            </Button>
          </Link>
        </div>
      )}

      {!isAgentsLoading && agents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Dropzone */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Document</CardTitle>
                <CardDescription>
                  Attach knowledge to{' '}
                  <span className="font-semibold text-foreground">
                    {agents.find((a) => a.id === selectedAgentId)?.name || 'selected agent'}
                  </span>
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
                    {uploadMutation.isPending ? 'Uploading to server...' : 'Drag PDF here or click to browse'}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Accepts .pdf files up to 25MB
                  </p>
                </div>

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
                    <span>Client-Side Verification</span>
                  </div>
                  <p>MIME validation ensures only valid PDF payloads are posted to the backend parser.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Uploaded Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base">
                    Uploaded Documents ({faqs.length})
                  </CardTitle>
                  <CardDescription>
                    Real-time index for{' '}
                    <span className="font-semibold text-foreground">
                      {agents.find((a) => a.id === selectedAgentId)?.name}
                    </span>
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
                {isFaqsError && (
                  <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-600 dark:text-rose-400">
                    <p className="font-semibold">Failed to fetch documents</p>
                    <p className="mt-1">{(faqsError as Error)?.message || 'Backend network failure'}</p>
                  </div>
                )}

                {isFaqsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                ) : faqs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-xl p-6">
                    <FileText className="h-8 w-8 text-muted-foreground/60 mb-2" />
                    <h4 className="text-sm font-semibold text-foreground">No documents uploaded for this agent</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      Upload your product FAQs or return guidelines using the dropzone on the left.
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
                                {formatDate(doc.uploadedAt)}
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
      )}
    </div>
  );
};
