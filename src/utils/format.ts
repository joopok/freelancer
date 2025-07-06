/**
 * 숫자를 읽기 쉬운 형식으로 포맷팅합니다.
 * @param num 포맷팅할 숫자
 * @returns 포맷팅된 문자열 (예: 1.5K, 1.2M)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅합니다.
 * @param date 날짜 문자열 또는 Date 객체
 * @returns 포맷팅된 날짜 문자열 (예: 2025.08.21)
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Invalid Date 체크
    if (isNaN(dateObj.getTime())) {
      return date.toString(); // 원본 문자열 반환
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.warn('Date formatting error:', error);
    return date?.toString() || '';
  }
};

/**
 * 날짜를 상대적인 시간으로 표시합니다.
 * @param date 날짜 문자열 또는 Date 객체
 * @returns 상대적인 시간 문자열 (예: 3일 전, 2개월 전)
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        if (diffInMinutes === 0) return '방금 전';
        return `${diffInMinutes}분 전`;
      }
      return `${diffInHours}시간 전`;
    }
    
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`;
    
    return `${Math.floor(diffInDays / 365)}년 전`;
  } catch (error) {
    console.warn('Relative time formatting error:', error);
    return '';
  }
};

/**
 * D-Day 계산
 * @param deadline 마감일
 * @returns D-Day 문자열 (예: D-7, D+3, D-Day)
 */
export const formatDDay = (deadline: string | Date | null | undefined): string => {
  if (!deadline) return '';
  
  try {
    const deadlineObj = typeof deadline === 'string' ? new Date(deadline) : deadline;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineObj.setHours(0, 0, 0, 0);
    
    const diffInMs = deadlineObj.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'D-Day';
    if (diffInDays > 0) return `D-${diffInDays}`;
    return `D+${Math.abs(diffInDays)}`;
  } catch (error) {
    console.warn('D-Day formatting error:', error);
    return '';
  }
};

/**
 * 금액을 만원 단위로 포맷팅합니다.
 * @param amount 금액 문자열 또는 숫자 (원 단위)
 * @returns 포맷팅된 금액 문자열 (예: 3억 5,000만원, 1,500만원)
 */
export const formatCurrency = (amount: string | number | null | undefined): string => {
  if (!amount) return '0원';
  
  try {
    // 문자열에서 숫자만 추출
    let numericAmount: number;
    if (typeof amount === 'string') {
      // "6000000~8000000" 같은 숫자 범위 처리
      const rangeMatch = amount.match(/^(\d+)(~|-)(\d+)$/);
      if (rangeMatch) {
        const min = parseInt(rangeMatch[1], 10) / 10000;
        const max = parseInt(rangeMatch[3], 10) / 10000;
        return formatCurrencyRange(min, max);
      }
      
      // "3-5억원", "1.5-2억원" 같은 범위 처리
      if (amount.includes('-') || amount.includes('~')) {
        return amount; // 범위는 그대로 반환
      }
      
      // "3,000만원", "3000만원", "30000000" 등의 형태 처리
      const cleanedAmount = amount.replace(/[^0-9]/g, '');
      numericAmount = parseInt(cleanedAmount, 10);
      
      // 이미 만원 단위로 표시된 경우 (예: "3000만원" -> 3000)
      if (amount.includes('만원') && numericAmount < 100000) {
        return amount; // 이미 만원 단위로 표시된 경우 그대로 반환
      }
    } else {
      numericAmount = amount;
    }
    
    if (isNaN(numericAmount)) return amount.toString();
    
    // 원 단위를 만원 단위로 변환 (10,000으로 나누기)
    const inManwon = numericAmount / 10000;
    
    // 억 단위 계산 (만원 기준으로 10,000만원 = 1억)
    const billion = Math.floor(inManwon / 10000);
    const million = Math.floor(inManwon % 10000);
    
    let result = '';
    
    if (billion > 0) {
      result += `${billion.toLocaleString('ko-KR')}억`;
      if (million > 0) {
        result += ` ${million.toLocaleString('ko-KR')}만원`;
      } else {
        result += '원';
      }
    } else if (inManwon >= 1) {
      result = `${Math.floor(inManwon).toLocaleString('ko-KR')}만원`;
    } else {
      // 1만원 미만인 경우 원 단위로 표시
      result = `${numericAmount.toLocaleString('ko-KR')}원`;
    }
    
    return result;
  } catch (error) {
    console.warn('Currency formatting error:', error);
    return amount?.toString() || '0원';
  }
};

/**
 * 금액 범위를 포맷팅합니다.
 * @param min 최소 금액 (만원 단위)
 * @param max 최대 금액 (만원 단위)
 * @param unit 단위 ('만원' 또는 '억원')
 * @returns 포맷팅된 금액 범위 문자열 (예: 600~800만원, 3~5억원)
 */
export const formatCurrencyRange = (min: number, max: number, unit: '만원' | '억원' = '만원'): string => {
  if (unit === '억원') {
    return `${min}~${max}억원`;
  }
  return `${min.toLocaleString('ko-KR')}~${max.toLocaleString('ko-KR')}만원`;
}; 