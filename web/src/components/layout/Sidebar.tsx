import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Box, Zap, Shield, Link as LinkIcon, GitBranch } from 'lucide-react';
import { useBoundedContext } from '../../contexts/BoundedContextContext';

export const Sidebar: React.FC = () => {
  const { currentContext } = useBoundedContext();

  if (!currentContext) return null;

  const navItems = [
    { to: '', icon: Home, label: 'Overview', end: true },
    { to: 'event-storming', icon: Sparkles, label: 'Event Storming' },
    { to: 'aggregates', icon: Box, label: 'Aggregates' },
    { to: 'commands-events', icon: Zap, label: 'Commands & Events' },
    { to: 'business-rules', icon: Shield, label: 'Business Rules' },
    { to: 'integrations', icon: LinkIcon, label: 'Integrations' },
    { to: 'workflows', icon: GitBranch, label: 'Workflows' },
  ];

  // Context color mapping
  const contextColors: Record<string, string> = {
    'order-management': 'from-chart-1 to-chart-1/80',
    'inventory': 'from-chart-3 to-chart-3/80',
    'payment': 'from-chart-4 to-chart-4/80',
    'fulfillment': 'from-chart-5 to-chart-5/80',
  };

  const gradientClass = contextColors[currentContext.id] || 'from-primary to-primary/80';

  return (
    <aside className="w-64 bg-secondary border-r border-[#6F797A] min-h-screen shadow-elevation-sm">
      <div className="p-4 border-b border-secondary-foreground/10">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-medium text-secondary-foreground">{currentContext.name}</h2>
            <p className="text-xs text-secondary-foreground/60">Bounded Context</p>
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded transition-colors text-sm ${
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-secondary-foreground/80 hover:bg-secondary-foreground/10 hover:text-secondary-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};