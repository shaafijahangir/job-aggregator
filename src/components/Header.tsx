
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User, Bookmark, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">JA</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Job Aggregator</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">BC Opportunities</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="/saved" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Saved Jobs
            </a>
            <a href="/settings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Settings
            </a>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
              <Bookmark className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
