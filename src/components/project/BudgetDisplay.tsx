'use client';

import { useFormatBudget } from '@/hooks/useFormatBudget';
import type { RemoteProject } from '@/types/remoteProject';

interface BudgetDisplayProps {
  project: RemoteProject;
  className?: string;
}

export default function BudgetDisplay({ project, className }: BudgetDisplayProps) {
  const formattedBudget = useFormatBudget(project);
  
  return (
    <span className={className}>
      {formattedBudget}
    </span>
  );
}