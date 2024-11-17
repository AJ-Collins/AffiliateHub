import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white">
      <div className="aspect-square bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}