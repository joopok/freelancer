/**
 * 환경 변수 검증 및 타입 안전성 제공
 */

// 필수 환경 변수 스키마
const envSchema = {
  // API 관련
  NEXT_PUBLIC_API_URL: {
    required: true,
    default: 'http://localhost:8080',
    validate: (value: string) => value.startsWith('http'),
  },
  NEXT_PUBLIC_USE_MOCK_API: {
    required: false,
    default: 'false',
    validate: (value: string) => ['true', 'false'].includes(value),
  },
  NEXT_PUBLIC_API_TIMEOUT: {
    required: false,
    default: '30000',
    validate: (value: string) => !isNaN(Number(value)),
  },
  
  // 인증 관련
  NEXT_PUBLIC_AUTH_TOKEN_NAME: {
    required: false,
    default: 'auth_token',
  },
  JWT_SECRET: {
    required: false, // 서버사이드 전용
    validate: (value: string) => value.length >= 32,
  },
  
  // WebSocket
  NEXT_PUBLIC_ENABLE_WEBSOCKET: {
    required: false,
    default: 'true',
    validate: (value: string) => ['true', 'false'].includes(value),
  },
  NEXT_PUBLIC_WS_URL: {
    required: false,
    default: 'http://localhost:9092',
    validate: (value: string) => value.startsWith('http') || value.startsWith('ws'),
  },
  
  // 분석 도구
  NEXT_PUBLIC_GA_MEASUREMENT_ID: {
    required: false,
    validate: (value: string) => value.startsWith('G-'),
  },
  NEXT_PUBLIC_SENTRY_DSN: {
    required: false,
    validate: (value: string) => value.includes('sentry.io'),
  },
  
  // 도메인
  NEXT_PUBLIC_DOMAIN: {
    required: false,
    default: 'https://techbridge.co.kr',
    validate: (value: string) => value.startsWith('http'),
  },
} as const;

type EnvSchema = typeof envSchema;
type EnvKeys = keyof EnvSchema;

// 환경 변수 타입
export type Env = {
  [K in EnvKeys]: string;
};

class EnvironmentValidator {
  private validated = false;
  private cache: Partial<Env> = {};

  /**
   * 환경 변수 검증
   */
  validate(): void {
    if (this.validated) return;

    const errors: string[] = [];
    const warnings: string[] = [];

    for (const [key, config] of Object.entries(envSchema)) {
      const value = process.env[key];

      // 기본값 설정
      const finalValue = value || config.default;
      
      // 필수 환경 변수 체크 (기본값이 없는 경우에만)
      if (config.required && !finalValue) {
        errors.push(`Missing required environment variable: ${key}`);
        continue;
      }
      
      // 값이 있으면 검증
      if (finalValue && config.validate) {
        if (!config.validate(finalValue)) {
          errors.push(`Invalid environment variable ${key}: ${finalValue}`);
          continue;
        }
      }

      // 캐시에 저장
      if (finalValue) {
        this.cache[key as EnvKeys] = finalValue;
      }
    }

    // 프로덕션 환경 추가 검증
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        warnings.push('Google Analytics is not configured for production');
      }
      if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
        warnings.push('Sentry is not configured for production');
      }
    }

    // 에러가 있으면 throw
    if (errors.length > 0) {
      console.error('Environment validation errors:', errors);
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment validation failed');
      }
    }

    // 경고 출력
    if (warnings.length > 0) {
      console.warn('Environment warnings:', warnings);
    }

    this.validated = true;
  }

  /**
   * 환경 변수 가져오기
   */
  get<K extends EnvKeys>(key: K): string {
    this.validate();
    return (this.cache[key] || envSchema[key].default || '') as string;
  }

  /**
   * 모든 환경 변수 가져오기
   */
  getAll(): Partial<Env> {
    this.validate();
    return { ...this.cache };
  }

  /**
   * 환경 확인
   */
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  /**
   * 특정 기능 활성화 여부
   */
  isFeatureEnabled(feature: 'MOCK_API' | 'WEBSOCKET' | 'ANALYTICS'): boolean {
    switch (feature) {
      case 'MOCK_API':
        return this.get('NEXT_PUBLIC_USE_MOCK_API') === 'true';
      case 'WEBSOCKET':
        return this.get('NEXT_PUBLIC_ENABLE_WEBSOCKET') === 'true';
      case 'ANALYTICS':
        return !!this.get('NEXT_PUBLIC_GA_MEASUREMENT_ID');
      default:
        return false;
    }
  }
}

// 싱글톤 인스턴스
export const env = new EnvironmentValidator();

// 편의 함수들
export const getApiUrl = () => env.get('NEXT_PUBLIC_API_URL');
export const getWsUrl = () => env.get('NEXT_PUBLIC_WS_URL');
export const getDomain = () => env.get('NEXT_PUBLIC_DOMAIN');
export const getApiTimeout = () => Number(env.get('NEXT_PUBLIC_API_TIMEOUT'));
export const getAuthTokenName = () => env.get('NEXT_PUBLIC_AUTH_TOKEN_NAME');

// 환경별 설정
export const config = {
  api: {
    url: getApiUrl(),
    timeout: getApiTimeout(),
    useMock: env.isFeatureEnabled('MOCK_API'),
  },
  auth: {
    tokenName: getAuthTokenName(),
  },
  websocket: {
    enabled: env.isFeatureEnabled('WEBSOCKET'),
    url: getWsUrl(),
  },
  analytics: {
    enabled: env.isFeatureEnabled('ANALYTICS'),
    gaId: env.get('NEXT_PUBLIC_GA_MEASUREMENT_ID'),
  },
  sentry: {
    dsn: env.get('NEXT_PUBLIC_SENTRY_DSN'),
  },
  domain: getDomain(),
};