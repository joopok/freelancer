# Claude Code Hooks 설정 가이드

이 프로젝트에는 Claude Code와 함께 사용할 수 있는 자동화 훅(Hooks)이 설정되어 있습니다.

## 🎣 활성화된 Hooks

### 1. **코드 품질 자동 검사** 
- TypeScript/JavaScript 파일 수정 시 자동으로 ESLint 실행
- 커밋 전 lint와 타입 체크 자동 실행

### 2. **코드 포맷팅**
- 파일 저장 후 자동으로 Prettier 적용

### 3. **톤 & 매너 검증**
- UI 컴포넌트 수정 시 자동으로 tone:validate 실행
- 사용자 친화적인 메시지 작성 가이드

### 4. **Git 보호**
- `git push` 명령 차단 (수동 푸시 권장)
- 커밋 전 코드 품질 검사

### 5. **개발 서버 관리**
- Claude Code 시작 시 자동으로 개발 서버 실행
- 종료 시 자동으로 서버 정리

### 6. **알림**
- 빌드 완료 시 macOS 알림
- 중요 작업 완료 시 알림

## 🚀 사용 가능한 커스텀 명령어

```bash
# 빠른 테스트 (lint + type check + tone validate)
quickTest

# 안전한 커밋 (검사 후 커밋)
safeCommit

# 개발 서버 상태 확인
devCheck
```

## ⚙️ Hooks 비활성화

특정 작업에서 hooks를 일시적으로 비활성화하려면:

1. 전체 hooks 비활성화: `~/.claude/settings.json`에서 hooks 섹션 제거
2. 특정 hook 비활성화: 해당 hook 항목 제거 또는 주석 처리

## 📝 추가 설정

프로젝트별 hooks는 `.claude/settings.json`에서 수정할 수 있습니다.
전역 hooks는 `~/.claude/settings.json`에서 설정됩니다.

## 🔍 문제 해결

- Hooks가 작동하지 않을 때: Claude Code를 재시작하세요
- 에러 발생 시: hook 명령어의 타임아웃을 늘려보세요
- 권한 문제: 스크립트 실행 권한을 확인하세요