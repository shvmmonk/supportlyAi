// API Contract Types

export interface SignupRequest {
  businessName: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  businessName: string;
  message?: string;
}

export interface UserSession {
  token: string;
  email: string;
  businessName: string;
}

export interface Agent {
  id: number;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string; // ISO datetime
}

export interface CreateAgentRequest {
  name: string;
  description?: string;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
}

export interface UpdateAgentStatusRequest {
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FAQDocument {
  id: number;
  fileName: string;
  uploadedAt: string; // ISO datetime
}

export interface WhatsAppIntegrationStatus {
  connected: boolean;
  mode: string; // "TEST" | "PRODUCTION"
  phoneNumberId?: string;
  displayPhoneNumber?: string;
  assignedAgentId?: number;
  assignedAgentName?: string;
  status: string; // "ACTIVE" | "NOT_CONFIGURED" | "DISCONNECTED"
  verified: boolean;
}

export interface AssignWhatsAppAgentRequest {
  agentId: number;
  phoneNumberId?: string;
  displayPhoneNumber?: string;
}

export interface Conversation {
  id: number;
  customerPhone: string;
  customerName?: string;
  agentId?: number;
  agentName?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  direction: 'INCOMING' | 'OUTGOING';
  content: string;
  status: 'RECEIVED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  metaMessageId?: string;
  timestamp: string;
}

export interface DashboardSummary {
  totalAgents: number;
  activeAgents: number;
  totalConversations: number;
  totalIncomingMessages: number;
  totalOutgoingMessages: number;
  failedMessages: number;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  errors?: Record<string, string> | string[];
}
