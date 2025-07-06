'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BeakerIcon,
  PlayIcon,
  StopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { recommendationService } from '@/services/recommendation';
import { 
  RecommendationRequest,
  RecommendationResponse,
  RecommendedProject
} from '@/types/recommendation';

interface TestCase {
  id: string;
  name: string;
  description: string;
  request: RecommendationRequest;
  expectedResults?: {
    minCount: number;
    maxCount: number;
    shouldContainSkills?: string[];
    shouldContainCategories?: string[];
  };
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: {
    response: RecommendationResponse;
    executionTime: number;
    error?: string;
  };
}

export default function RecommendationTestPage() {
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'user-based-1',
      name: '사용자 기반 추천 - React 개발자',
      description: 'React 스킬을 가진 사용자에게 React 프로젝트 추천',
      request: {
        userId: 'test-user-1',
        type: 'user-based',
        limit: 5
      },
      expectedResults: {
        minCount: 1,
        maxCount: 5,
        shouldContainSkills: ['React']
      },
      status: 'pending'
    },
    {
      id: 'project-similarity-1',
      name: '프로젝트 유사성 추천',
      description: '특정 프로젝트와 유사한 프로젝트 추천',
      request: {
        projectId: '1',
        type: 'project-similarity',
        limit: 5
      },
      expectedResults: {
        minCount: 1,
        maxCount: 5
      },
      status: 'pending'
    },
    {
      id: 'popularity-1',
      name: '인기도 기반 추천',
      description: '조회수와 지원자 수가 높은 인기 프로젝트 추천',
      request: {
        type: 'popularity',
        limit: 10
      },
      expectedResults: {
        minCount: 1,
        maxCount: 10
      },
      status: 'pending'
    },
    {
      id: 'hybrid-1',
      name: '하이브리드 추천',
      description: '여러 알고리즘을 조합한 하이브리드 추천',
      request: {
        userId: 'test-user-1',
        type: 'hybrid',
        limit: 8
      },
      expectedResults: {
        minCount: 1,
        maxCount: 8
      },
      status: 'pending'
    },
    {
      id: 'filtered-1',
      name: '필터링된 추천',
      description: '특정 카테고리와 예산 범위로 필터링된 추천',
      request: {
        type: 'hybrid',
        limit: 5,
        filters: {
          category: '웹개발',
          budgetRange: { min: 3000000, max: 8000000 }
        }
      },
      expectedResults: {
        minCount: 1,
        maxCount: 5,
        shouldContainCategories: ['웹개발']
      },
      status: 'pending'
    },
    {
      id: 'performance-1',
      name: '성능 테스트',
      description: '대량 추천 요청 성능 테스트',
      request: {
        type: 'popularity',
        limit: 50
      },
      expectedResults: {
        minCount: 1,
        maxCount: 50
      },
      status: 'pending'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    averageTime: number;
  }>({
    total: 0,
    passed: 0,
    failed: 0,
    averageTime: 0
  });

  // 개별 테스트 실행
  const runSingleTest = async (testCase: TestCase): Promise<TestCase> => {
    const startTime = Date.now();
    
    try {
      setCurrentTest(testCase.id);
      
      // 테스트 실행 중 상태로 업데이트
      setTestCases(prev => 
        prev.map(tc => 
          tc.id === testCase.id 
            ? { ...tc, status: 'running' as const }
            : tc
        )
      );

      const response = await recommendationService.getRecommendations(testCase.request);
      const executionTime = Date.now() - startTime;

      // 결과 검증
      const isValid = validateTestResult(testCase, response);
      
      const updatedTestCase: TestCase = {
        ...testCase,
        status: isValid ? 'passed' : 'failed',
        result: {
          response,
          executionTime,
          error: isValid ? undefined : '예상 결과와 일치하지 않음'
        }
      };

      console.log(`✅ 테스트 ${testCase.name} 완료:`, {
        passed: isValid,
        executionTime,
        resultCount: response.recommendations.length
      });

      return updatedTestCase;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      
      console.error(`❌ 테스트 ${testCase.name} 실패:`, error);
      
      return {
        ...testCase,
        status: 'failed',
        result: {
          response: { recommendations: [], metadata: { totalCount: 0, algorithm: '', executionTime: 0, version: '', cacheHit: false } },
          executionTime,
          error: errorMessage
        }
      };
    }
  };

  // 테스트 결과 검증
  const validateTestResult = (testCase: TestCase, response: RecommendationResponse): boolean => {
    const { expectedResults } = testCase;
    if (!expectedResults) return true;

    const recommendations = response.recommendations;

    // 개수 검증
    if (recommendations.length < expectedResults.minCount || 
        recommendations.length > expectedResults.maxCount) {
      console.warn(`개수 검증 실패: ${recommendations.length} (예상: ${expectedResults.minCount}-${expectedResults.maxCount})`);
      return false;
    }

    // 스킬 검증
    if (expectedResults.shouldContainSkills) {
      const hasExpectedSkills = expectedResults.shouldContainSkills.some(skill =>
        recommendations.some(rec => 
          rec.skills?.includes(skill) || rec.matchingSkills?.includes(skill)
        )
      );
      if (!hasExpectedSkills) {
        console.warn('스킬 검증 실패:', expectedResults.shouldContainSkills);
        return false;
      }
    }

    // 카테고리 검증
    if (expectedResults.shouldContainCategories) {
      const hasExpectedCategories = expectedResults.shouldContainCategories.some(category =>
        recommendations.some(rec => rec.category === category)
      );
      if (!hasExpectedCategories) {
        console.warn('카테고리 검증 실패:', expectedResults.shouldContainCategories);
        return false;
      }
    }

    return true;
  };

  // 모든 테스트 실행
  const runAllTests = async () => {
    setIsRunning(true);
    setCurrentTest(null);
    
    const startTime = Date.now();
    const updatedTestCases: TestCase[] = [];
    
    try {
      for (const testCase of testCases) {
        const result = await runSingleTest(testCase);
        updatedTestCases.push(result);
        
        // UI 업데이트
        setTestCases(prev => 
          prev.map(tc => tc.id === result.id ? result : tc)
        );
        
        // 테스트 간 지연 (과부하 방지)
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // 결과 통계 계산
      const totalTime = Date.now() - startTime;
      const passedTests = updatedTestCases.filter(tc => tc.status === 'passed');
      const failedTests = updatedTestCases.filter(tc => tc.status === 'failed');
      const avgExecutionTime = updatedTestCases.reduce((sum, tc) => 
        sum + (tc.result?.executionTime || 0), 0
      ) / updatedTestCases.length;

      setTestResults({
        total: updatedTestCases.length,
        passed: passedTests.length,
        failed: failedTests.length,
        averageTime: avgExecutionTime
      });

      console.log('🏁 모든 테스트 완료:', {
        total: updatedTestCases.length,
        passed: passedTests.length,
        failed: failedTests.length,
        totalTime,
        averageTime: avgExecutionTime
      });
      
    } catch (error) {
      console.error('테스트 실행 중 오류:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  };

  // 테스트 초기화
  const resetTests = () => {
    setTestCases(prev => 
      prev.map(tc => ({ 
        ...tc, 
        status: 'pending' as const, 
        result: undefined 
      }))
    );
    setTestResults({
      total: 0,
      passed: 0,
      failed: 0,
      averageTime: 0
    });
    setCurrentTest(null);
  };

  // 테스트 상태별 스타일
  const getStatusColor = (status: TestCase['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-500';
      case 'running': return 'text-blue-500';
      case 'passed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      case 'running': return <BoltIcon className="h-5 w-5 animate-pulse" />;
      case 'passed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'failed': return <XCircleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-2xl">
                <BeakerIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  추천 시스템 테스트
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  추천 알고리즘의 정확성과 성능을 검증합니다
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={resetTests}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <ArrowPathIcon className="h-4 w-4" />
                초기화
              </button>
              
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <StopIcon className="h-4 w-4" />
                    테스트 실행 중...
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    모든 테스트 실행
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 테스트 결과 요약 */}
          {testResults.total > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">총 테스트</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {testResults.total}
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">성공</span>
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {testResults.passed}
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">실패</span>
                </div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {testResults.failed}
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <BoltIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">평균 시간</span>
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {Math.round(testResults.averageTime)}ms
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 테스트 케이스 목록 */}
        <div className="space-y-4">
          {testCases.map((testCase, index) => (
            <motion.div
              key={testCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 ${
                testCase.status === 'passed' ? 'border-green-500' :
                testCase.status === 'failed' ? 'border-red-500' :
                testCase.status === 'running' ? 'border-blue-500' :
                'border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={getStatusColor(testCase.status)}>
                      {getStatusIcon(testCase.status)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testCase.name}
                    </h3>
                    {currentTest === testCase.id && (
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                        실행 중
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {testCase.description}
                  </p>

                  {/* 테스트 설정 */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <h4 className="font-medium mb-2">테스트 설정</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">타입:</span>
                        <span className="ml-2 font-medium">{testCase.request.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">제한:</span>
                        <span className="ml-2 font-medium">{testCase.request.limit}</span>
                      </div>
                      {testCase.request.userId && (
                        <div>
                          <span className="text-gray-500">사용자 ID:</span>
                          <span className="ml-2 font-medium">{testCase.request.userId}</span>
                        </div>
                      )}
                      {testCase.request.projectId && (
                        <div>
                          <span className="text-gray-500">프로젝트 ID:</span>
                          <span className="ml-2 font-medium">{testCase.request.projectId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 테스트 결과 */}
                  {testCase.result && (
                    <div className={`rounded-lg p-4 ${
                      testCase.status === 'passed' ? 'bg-green-50 dark:bg-green-900/20' :
                      'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <h4 className="font-medium mb-2">테스트 결과</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">실행 시간:</span>
                          <span className="ml-2 font-medium">{testCase.result.executionTime}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-500">결과 수:</span>
                          <span className="ml-2 font-medium">{testCase.result.response.recommendations.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">캐시 적중:</span>
                          <span className="ml-2 font-medium">
                            {testCase.result.response.metadata.cacheHit ? '예' : '아니오'}
                          </span>
                        </div>
                      </div>
                      
                      {testCase.result.error && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/50 rounded text-red-700 dark:text-red-300 text-sm">
                          <div className="flex items-center gap-2">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span className="font-medium">오류:</span>
                          </div>
                          <p className="mt-1">{testCase.result.error}</p>
                        </div>
                      )}

                      {/* 추천 결과 미리보기 */}
                      {testCase.result.response.recommendations.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2">추천 결과 미리보기 (상위 3개)</h5>
                          <div className="space-y-2">
                            {testCase.result.response.recommendations.slice(0, 3).map((rec, idx) => (
                              <div key={rec.id} className="bg-white dark:bg-gray-800 rounded p-3 text-xs">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h6 className="font-medium truncate">{rec.title}</h6>
                                    <p className="text-gray-500 truncate">{rec.description}</p>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="text-xs text-gray-500">점수</div>
                                    <div className="font-medium">
                                      {rec.recommendationScore.total.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="ml-6">
                  <button
                    onClick={() => runSingleTest(testCase)}
                    disabled={isRunning}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    실행
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 도움말 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                테스트 가이드
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 각 테스트는 특정 추천 알고리즘의 동작을 검증합니다</li>
                <li>• 테스트 결과는 예상 결과와 비교하여 성공/실패를 판단합니다</li>
                <li>• 성능 테스트는 응답 시간과 캐시 효율성을 측정합니다</li>
                <li>• 모든 테스트를 실행하면 전체 시스템의 건전성을 확인할 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}