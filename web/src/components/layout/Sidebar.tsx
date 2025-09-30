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

  // Dynamic gradient based on context type
  const getGradientClass = () => {
    switch (currentContext.type) {
      case 'FEATURE':
        return 'from-blue-500 to-blue-600';
      case 'APPLICATION':
        return 'from-green-500 to-green-600';
      case 'SYSTEM':
        return 'from-purple-500 to-purple-600';
      case 'TEAM':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const gradientClass = getGradientClass();

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