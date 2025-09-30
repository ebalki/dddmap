import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Plus } from 'lucide-react';
import { ContextSelector } from './ContextSelector';
import { Button } from '../ui/Button';

interface AppShellProps {
  children: ReactNode;
  showSidebar?: boolean;
  sidebar?: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children, showSidebar = false, sidebar }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-[#6F797A] sticky top-0 z-40 shadow-elevation-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
                  <Box className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-medium text-foreground">DDD Platform</h1>
                  <p className="text-xs text-muted-foreground">Domain-Driven Design</p>
                </div>
              </button>

              <div className="h-10 w-px bg-border"></div>

              <ContextSelector />
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/requirement/new')}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Requirement
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {showSidebar && sidebar}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};