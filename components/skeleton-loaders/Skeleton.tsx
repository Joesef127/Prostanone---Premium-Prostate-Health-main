import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Base pulsing placeholder block. Compose these to recreate any layout. */
const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

export default Skeleton;
