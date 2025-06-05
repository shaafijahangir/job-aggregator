
import React, { useState } from 'react';
import { JobDashboard } from '@/components/JobDashboard';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <JobDashboard />
    </div>
  );
};

export default Index;
