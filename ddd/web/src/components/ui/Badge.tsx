import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'event' | 'command' | 'aggregate' | 'rule' | 'integration' | 'success' | 'warning' | 'error' | 'secondary' | 'muted';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium';

  const variants = {
    default: 'bg-muted text-muted-foreground',
    event: 'bg-event/10 text-event border border-event/20',
    command: 'bg-command/10 text-command border border-command/20',
    aggregate: 'bg-aggregate/10 text-aggregate border border-aggregate/20',
    rule: 'bg-rule/10 text-rule border border-rule/20',
    integration: 'bg-integration/10 text-integration border border-integration/20',
    success: 'bg-chart-3/10 text-chart-3 border border-chart-3/20',
    warning: 'bg-event/10 text-event border border-event/20',
    error: 'bg-destructive/10 text-destructive border border-destructive/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    muted: 'bg-muted/30 text-muted-foreground border border-muted',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
};