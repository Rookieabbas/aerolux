import React from 'react';

export function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`animate-pulse bg-surface-card border border-border/40 ${rounded} ${className}`}
    />
  );
}

export function JetCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden p-0 flex flex-col h-full">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
        <div>
          <div className="flex justify-between items-start mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/60">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-border/50">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="p-4">
          <Skeleton className="h-5 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}
