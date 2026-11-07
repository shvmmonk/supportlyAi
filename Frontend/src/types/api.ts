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
  status: string; // Backend-provided enum string (e.g. "ACTIVE", etc.)
  createdAt: string; // ISO datetime
}

export interface CreateAgentRequest {
  name: string;
}

export interface FAQDocument {
  id: number;
  fileName: string;
  uploadedAt: string; // ISO datetime
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  errors?: Record<string, string> | string[];
}
