'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { TechDashboard } from '@/components/dashboard/TechDashboard';
import { ClientDashboard } from '@/components/dashboard/ClientDashboard';

export default function DashboardPage() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (role === 'TECNICO') {
    return <TechDashboard />;
  }

  return <ClientDashboard />;
}
