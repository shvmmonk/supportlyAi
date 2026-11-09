import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, FileText, MessageSquare, BarChart3, Settings, Sparkles, Smartphone, X, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps { isOpen: boolean; onClose: () => void; }

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { session } = useAuth();
  const navItems = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { name: 'AI Agents', to: '/dashboard/agents', icon: Bot },
    { name: 'AI Playground', to: '/dashboard/playground', icon: FlaskConical },
    { name: 'Knowledge Base', to: '/dashboard/knowledge-base', icon: FileText },
    { name: 'WhatsApp', to: '/dashboard/whatsapp', icon: Smartphone, badge: 'Twilio' },
    { name: 'Conversations', to: '/dashboard/conversations', icon: MessageSquare, badge: 'Soon' },
    { name: 'Analytics', to: '/dashboard/analytics', icon: BarChart3, badge: 'Soon' },
    { name: 'Settings', to: '/dashboard/settings', icon: Settings },
  ];
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity" onClick={onClose} aria-hidden="true" />}
      <aside className={cn('fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out lg:static lg:translate-x-0', isOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-border/60">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20"><Sparkles className="h-5 w-5" /></div>
            <div><span className="font-semibold text-base tracking-tight text-foreground block">Supportly<span className="text-indigo-600 dark:text-indigo-400">AI</span></span><span className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground block -mt-1">WhatsApp Agent</span></div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden" aria-label="Close sidebar"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return <NavLink key={item.to} to={item.to} end={item.end} onClick={() => { if (window.innerWidth < 1024) onClose(); }} className={({ isActive }) => cn('group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150', isActive ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              {({ isActive }) => <><div className="flex items-center space-x-3"><Icon className={cn('h-4 w-4 transition-colors', isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground group-hover:text-foreground')} /><span>{item.name}</span></div>{'badge' in item && item.badge && <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase', item.badge === 'Soon' ? 'bg-muted text-muted-foreground' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400')}>{item.badge}</span>}</>}
            </NavLink>;
          })}
        </nav>
        <div className="p-3 border-t border-border/60"><div className="flex items-center space-x-3 rounded-lg bg-muted/40 p-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 font-medium text-xs text-indigo-600 dark:text-indigo-400">{session?.businessName ? session.businessName.charAt(0).toUpperCase() : 'B'}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-foreground">{session?.businessName || 'My Business'}</p><p className="truncate text-[11px] text-muted-foreground">{session?.email || 'Authenticated'}</p></div></div></div>
      </aside>
    </>
  );
};
