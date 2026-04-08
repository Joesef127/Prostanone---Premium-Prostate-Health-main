import React from 'react';
import { LogOut, User } from 'lucide-react';

interface AdminHeaderProps {
  adminEmail: string | null;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ adminEmail, onLogout }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <User className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-text">Admin Dashboard</h1>
        <p className="text-text-muted text-sm">{adminEmail}</p>
      </div>
    </div>
    <button
      onClick={onLogout}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text hover:border-text-muted transition-colors text-sm w-fit"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  </div>
);

export default AdminHeader;
