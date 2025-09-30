import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = false }) => {
  const hoverClass = hover ? 'hover:shadow-elevation-sm hover:-translate-y-0.5 cursor-pointer' : '';

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border border-[#6F797A] shadow-sm transition-all ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 border-b border-[#6F797A] ${className}`}>{children}</div>;
};

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 border-t border-[#6F797A] bg-muted/10 rounded-b-lg ${className}`}>{children}</div>;
};