import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Bot, Send, Trash2, AlertCircle, Loader2, Sparkles, UserRound } from 'lucide-react';
import { agentsApi } from '@/api/agents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

type Message = { id: number; role: 'user' | 'assistant'; content: string };

export const AIPlaygroundPage: React.FC = () => {
  const { data: agents = [], isLoading, isError, error } = useQuery({
    queryKey: ['agents'], queryFn: agentsApi.getAgents,
  });
  const [agentId, setAgentId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentAgent = agents.find((agent) => agent.id === agentId);

  useEffect(() => {
    if (agents.length && (agentId === null || !agents.some((agent) => agent.id === agentId))) {
      setAgentId(agents[0].id);
    }
  }, [agents, agentId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const askMutation = useMutation({
    mutationFn: ({ selectedId, prompt }: { selectedId: number; prompt: string }) =>
      agentsApi.testRagAnswer(selectedId, prompt),
    onSuccess: (answer) => {
      setMessages((previous) => [...previous, { id: nextId.current++, role: 'assistant', content: answer || 'The agent returned an empty response.' }]);
    },
    onError: (err: Error) => {
      toast.error('Unable to get AI response', { description: err.message });
      setMessages((previous) => [...previous, { id: nextId.current++, role: 'assistant', content: 'Sorry, the request failed. Please try again.' }]);
    },
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt || agentId === null || askMutation.isPending) return;
    if (prompt.length > 2000) { toast.error('Question must be 2,000 characters or fewer'); return; }
    setMessages((previous) => [...previous, { id: nextId.current++, role: 'user', content: prompt }]);
    setQuestion('');
    askMutation.mutate({ selectedId: agentId, prompt });
  };

  const changeAgent = (value: string) => {
    if (askMutation.isPending) return;
    setAgentId(Number(value));
    setMessages([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><Sparkles className="h-6 w-6 text-indigo-500" /><h1 className="text-2xl font-bold tracking-tight">AI Playground</h1></div>
          <p className="mt-1 text-sm text-muted-foreground">Test how your agent answers questions using its uploaded knowledge base.</p>
        </div>
        <Button variant="outline" onClick={() => setMessages([])} disabled={askMutation.isPending || messages.length === 0}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear Chat
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Select an AI agent</CardTitle><CardDescription>Switching agents clears the current chat.</CardDescription></CardHeader>
        <CardContent>
          {isLoading ? <p className="text-sm text-muted-foreground">Loading agents...</p> : isError ? (
            <p className="flex items-center gap-2 text-sm text-rose-500"><AlertCircle className="h-4 w-4" />{(error as Error)?.message || 'Could not load agents'}</p>
          ) : agents.length === 0 ? <p className="text-sm text-muted-foreground">No agents yet. Create an agent in AI Agents first.</p> : (
            <select aria-label="Select AI agent" value={agentId ?? ''} onChange={(e) => changeAgent(e.target.value)} disabled={askMutation.isPending}
              className="w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name} (#{agent.id} · {agent.status})</option>)}
            </select>
          )}
          {currentAgent && <p className="mt-2 text-xs text-muted-foreground">{currentAgent.description || 'No description'} · Status: {currentAgent.status}</p>}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b"><CardTitle className="flex items-center gap-2 text-base"><Bot className="h-5 w-5 text-indigo-500" /> Agent chat</CardTitle><CardDescription>Each question is answered independently. Chat history is only displayed in this browser session.</CardDescription></CardHeader>
        <CardContent className="p-0">
          <div className="h-[430px] overflow-y-auto space-y-4 p-4 sm:p-6" aria-live="polite">
            {messages.length === 0 && <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground"><Bot className="mb-3 h-10 w-10 text-indigo-400" /><p className="text-sm font-medium text-foreground">Ask your agent anything</p><p className="mt-1 max-w-sm text-xs">Try asking about a policy or FAQ you uploaded. Answers depend on the backend RAG service.</p></div>}
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <Bot className="mt-2 h-5 w-5 shrink-0 text-indigo-500" />}
                <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'bg-indigo-600 text-white' : 'border border-border bg-muted/40 text-foreground'}`}>{message.content}</div>
                {message.role === 'user' && <UserRound className="mt-2 h-5 w-5 shrink-0 text-muted-foreground" />}
              </div>
            ))}
            {askMutation.isPending && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Agent is thinking...</div>}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={submit} className="flex items-end gap-3 border-t p-4">
            <textarea aria-label="Question for AI agent" rows={2} maxLength={2000} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about your uploaded FAQs..." disabled={agentId === null || askMutation.isPending}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
              className="min-h-[70px] flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <Button type="submit" disabled={agentId === null || !question.trim() || askMutation.isPending}>
              {askMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}<span className="ml-2 hidden sm:inline">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
