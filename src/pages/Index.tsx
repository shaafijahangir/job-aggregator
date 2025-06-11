
import React from 'react';
import { JobDashboard } from '@/components/JobDashboard';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <JobDashboard />
    </div>
  );
};

export default Index;
