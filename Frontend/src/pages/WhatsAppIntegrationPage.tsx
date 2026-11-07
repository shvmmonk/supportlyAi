import React, { useState } from 'react';
import {
  Smartphone,
  Copy,
  Check,
  AlertTriangle,
  Server,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const WhatsAppIntegrationPage: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Webhook URL constructed from base URL
  const backendBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const webhookUrl = `${backendBase}/api/whatsapp/webhook`;

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success('Webhook URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          WhatsApp Integration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your Twilio WhatsApp Business number or sandbox to your Spring Boot support backend.
        </p>
      </div>

      {/* Explicit Connection Status Banner: NOT VERIFIED */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Twilio Webhook Status
                </h3>
                {/* Explicit Not Verified State - Never fabricated */}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5" />
                  Not Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verification status is confirmed server-side when incoming Twilio test messages hit the webhook endpoint.
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground self-start sm:self-auto font-mono">
            Protocol: HTTP POST / TwiML
          </div>
        </CardContent>
      </Card>

      {/* Security Architecture Notice: Zero Frontend Secrets */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold">
          <Lock className="h-4 w-4" />
          <span>Security Architecture & Secret Isolation</span>
        </div>
        <p className="leading-relaxed">
          In strict accordance with security best practices, Twilio Auth Tokens, Twilio Account SIDs, and Groq LLM API keys are stored solely in the Spring Boot backend environment (<code className="text-foreground font-mono">application.properties</code> or system env). The frontend client never handles, stores, or accesses these secrets.
        </p>
      </div>

      {/* Webhook Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inbound Webhook Endpoint</CardTitle>
          <CardDescription>
            Configure this exact URL in your Twilio Console under WhatsApp Sandbox / Messaging settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="w-full h-10 px-3.5 font-mono text-xs rounded-lg bg-muted/60 border border-border text-foreground select-all focus:outline-none"
              />
            </div>
            <Button
              onClick={copyWebhookUrl}
              variant="outline"
              className="h-10 text-xs shrink-0"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copy Endpoint
                </>
              )}
            </Button>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
            <div className="flex items-center space-x-1.5 font-medium text-foreground/80">
              <Server className="h-3.5 w-3.5 text-indigo-500" />
              <span>Server-to-Server Webhook Note</span>
            </div>
            <p>
              The frontend never calls <code className="text-foreground font-mono">POST /api/whatsapp/webhook</code> directly. Twilio servers deliver WhatsApp message payloads directly to this backend endpoint. Currently, this endpoint produces a static TwiML response.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Setup Step-by-Step Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Twilio WhatsApp Sandbox Setup Guide</CardTitle>
          <CardDescription>
            Follow these steps to route customer WhatsApp chats to SupportlyAI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="space-y-2 rounded-xl border border-border p-4 bg-card">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                1
              </div>
              <h4 className="text-sm font-semibold text-foreground">Access Twilio Sandbox</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log in to the Twilio Console and navigate to <strong>Messaging &gt; Try WhatsApp &gt; Send a WhatsApp Message</strong>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 rounded-xl border border-border p-4 bg-card">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                2
              </div>
              <h4 className="text-sm font-semibold text-foreground">Configure Webhook URL</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Under Sandbox Configuration, paste the Webhook URL into the field <strong>&ldquo;WHEN A MESSAGE COMES IN&rdquo;</strong> with method set to <strong>HTTP POST</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2 rounded-xl border border-border p-4 bg-card">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                3
              </div>
              <h4 className="text-sm font-semibold text-foreground">Test Inbound Message</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Send the sandbox join keyword from your personal WhatsApp to test delivery. Spring Boot will receive the webhook and reply with TwiML.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-muted-foreground flex items-start space-x-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Testing locally with ngrok / Localtunnel</p>
              <p className="mt-0.5 leading-relaxed">
                If running Spring Boot on <code className="text-foreground font-mono">http://localhost:8080</code>, expose port 8080 via a tunnel tool like <code className="text-foreground font-mono">ngrok http 8080</code> so Twilio servers on the public internet can send HTTP POST webhook requests to your local instance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
