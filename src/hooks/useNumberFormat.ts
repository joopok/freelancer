import { useMemo } from 'react';

/**
 * 숫자에 천 단위 콤마를 추가하는 커스텀 훅
 */
export const useNumberFormat = () => {
  /**
   * 숫자나 문자열을 받아서 천 단위 콤마가 포함된 문자열로 변환
   * @param value - 포맷팅할 숫자 또는 문자열
   * @returns 콤마가 포함된 문자열
   */
  const formatNumber = useMemo(() => {
    return (value: number | string | undefined | null): string => {
      if (value === undefined || value === null) return '';
      
      // 숫자로 변환
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
      
      if (isNaN(numValue)) return String(value);
      
      // 천 단위 콤마 추가
      return numValue.toLocaleString('ko-KR');
    };
  }, []);

  /**
   * 금액 범위를 포맷팅 (예: 1000000 ~ 2000000 => 1,000,000 ~ 2,000,000)
   * @param min - 최소 금액
   * @param max - 최대 금액
   * @param unit - 단위 (기본값: '원')
   * @returns 포맷팅된 금액 범위 문자열
   */
  const formatCurrencyRange = useMemo(() => {
    return (min?: number, max?: number, unit: string = '원'): string => {
      if (!min && !max) return '협의';
      if (min && !max) return `${formatNumber(min)}${unit} 이상`;
      if (!min && max) return `${formatNumber(max)}${unit} 이하`;
      return `${formatNumber(min)} ~ ${formatNumber(max)}${unit}`;
    };
  }, [formatNumber]);

  /**
   * 만원 단위로 변환하여 포맷팅
   * @param value - 원 단위 금액
   * @returns 만원 단위로 변환된 포맷팅된 문자열
   */
  const formatToManwon = useMemo(() => {
    return (value: number | string | undefined | null): string => {
      if (value === undefined || value === null) return '';
      
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
      
      if (isNaN(numValue)) return String(value);
      
      const manwonValue = Math.floor(numValue / 10000);
      return formatNumber(manwonValue);
    };
  }, [formatNumber]);

  /**
   * 만원 단위 금액 범위를 포맷팅
   * @param min - 최소 금액 (원 단위)
   * @param max - 최대 금액 (원 단위)
   * @returns 포맷팅된 만원 단위 금액 범위
   */
  const formatManwonRange = useMemo(() => {
    return (min?: number, max?: number): string => {
      if (!min && !max) return '협의';
      if (min && !max) return `${formatToManwon(min)}만원 이상`;
      if (!min && max) return `${formatToManwon(max)}만원 이하`;
      return `${formatToManwon(min)}~${formatToManwon(max)}만원`;
    };
  }, [formatToManwon]);

  return {
    formatNumber,
    formatCurrencyRange,
    formatToManwon,
    formatManwonRange
  };
};