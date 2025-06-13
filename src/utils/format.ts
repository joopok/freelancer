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