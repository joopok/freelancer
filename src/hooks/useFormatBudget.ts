import { useMemo } from 'react';
import type { RemoteProject } from '@/types/remoteProject';

export function useFormatBudget(project: RemoteProject | null | undefined) {
  return useMemo(() => {
    if (!project) return '';
    
    // Check if budget is an object (from backend API)
    if (typeof project.budget === 'object' && project.budget !== null) {
      const budgetObj = project.budget;
      const amount = budgetObj.amount || '';
      const negotiable = budgetObj.negotiable ? ' (협의가능)' : '';
      
      // Format amount with comma separation
      const formattedAmount = amount.includes('~') 
        ? amount.split('~').map(num => {
            const parsed = parseInt(num.replace(/[^0-9]/g, ''));
            return isNaN(parsed) ? num : parsed.toLocaleString('ko-KR');
          }).join('~')
        : (() => {
            const parsed = parseInt(amount.replace(/[^0-9]/g, ''));
            return isNaN(parsed) ? amount : parsed.toLocaleString('ko-KR');
          })();
      
      if (budgetObj.type === 'hourly') {
        return `시간당 ${formattedAmount}원${negotiable}`;
      }
      return `${formattedAmount}원${negotiable}`;
    }
    
    // Handle string budget (fallback)
    if (typeof project.budget === 'string') {
      // Format amount with comma separation
      const amount = project.budget;
      const formattedAmount = amount.includes('~')
        ? amount.split('~').map(num => {
            const parsed = parseInt(num.replace(/[^0-9]/g, ''));
            return isNaN(parsed) ? num : parsed.toLocaleString('ko-KR');
          }).join('~')
        : (() => {
            const parsed = parseInt(amount.replace(/[^0-9]/g, ''));
            return isNaN(parsed) ? amount : parsed.toLocaleString('ko-KR');
          })();
      
      if (project.budgetType === 'hourly') {
        return `시간당 ${formattedAmount}원`;
      }
      return `${formattedAmount}원`;
    }
    
    return '';
  }, [project]);
}