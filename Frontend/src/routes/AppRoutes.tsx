import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { DashboardOverviewPage } from '@/pages/DashboardOverviewPage';
import { AgentsPage } from '@/pages/AgentsPage';
import { AgentDetailPage } from '@/pages/AgentDetailPage';
import { KnowledgeBasePage } from '@/pages/KnowledgeBasePage';
import { WhatsAppIntegrationPage } from '@/pages/WhatsAppIntegrationPage';
import { ConversationsPage } from '@/pages/ConversationsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverviewPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="agents/:id" element={<AgentDetailPage />} />
        <Route path="knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="whatsapp" element={<WhatsAppIntegrationPage />} />
        <Route path="conversations" element={<ConversationsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
