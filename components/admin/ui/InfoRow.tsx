import React from 'react';

interface InfoRowProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, children }) => (
  <div className="flex items-start gap-2 text-sm text-text-muted">
    <span className="mt-0.5 shrink-0 text-text-light">{icon}</span>
    <span className="truncate">{children}</span>
  </div>
);

export default InfoRow;
