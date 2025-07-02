import React from 'react';
import { useApi, useMutation } from '@/hooks/useApi';
import { API_URLS } from '@/constants/apiUrls';

// 사용 예시들
export function ExampleComponent() {
  // 1. 단순 GET 요청
  const { data: categories, loading, error, refetch } = useApi(
    API_URLS.CATEGORIES
  );

  // 2. 파라미터가 있는 GET 요청
  const { data: freelancers } = useApi(
    API_URLS.FREELANCERS.LIST,
    {
      params: {
        page: 1,
        limit: 10,
        skill: 'React'
      }
    }
  );

  // 3. 자동 호출 비활성화 (수동 호출)
  const { data: projects, refetch: fetchProjects } = useApi(
    API_URLS.PROJECTS.LIST,
    {
      autoFetch: false, // 자동 호출 비활성화
      onSuccess: (data) => {
        console.log('프로젝트 로드 성공:', data);
      },
      onError: (error) => {
        console.error('프로젝트 로드 실패:', error);
      }
    }
  );

  // 4. POST 요청 (Mutation)
  const { mutate: createProject, loading: creating } = useMutation(
    API_URLS.PROJECTS.CREATE,
    {
      method: 'POST',
      onSuccess: (data) => {
        console.log('프로젝트 생성 성공:', data);
        // 리스트 새로고침
        refetch();
      },
      onError: (error) => {
        console.error('프로젝트 생성 실패:', error);
      }
    }
  );

  // 5. PUT 요청 (동적 URL)
  const { mutate: updateProject } = useMutation(
    (variables: { id: number; data: any }) => API_URLS.PROJECTS.UPDATE(variables.id),
    {
      method: 'PUT',
      onSuccess: (data, variables) => {
        console.log(`프로젝트 ${variables.id} 업데이트 성공`);
      }
    }
  );

  // 6. DELETE 요청
  const { mutate: deleteProject } = useMutation(
    (id: number) => API_URLS.PROJECTS.DELETE(id),
    {
      method: 'DELETE',
      onSuccess: (_, id) => {
        console.log(`프로젝트 ${id} 삭제 성공`);
        refetch(); // 리스트 새로고침
      }
    }
  );

  // 사용 예시
  const handleCreateProject = () => {
    createProject({
      title: '새 프로젝트',
      description: '프로젝트 설명',
      budget: 1000000
    });
  };

  const handleUpdateProject = (id: number) => {
    updateProject({
      id,
      data: {
        title: '수정된 프로젝트',
        description: '수정된 설명'
      }
    });
  };

  const handleDeleteProject = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteProject(id);
    }
  };

  // 헤더 설정이 필요한 경우
  const { data: privateData } = useApi(
    API_URLS.USER.PROFILE,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    }
  );

  return (
    <div>
      {/* 로딩 상태 */}
      {loading && <div>로딩 중...</div>}
      
      {/* 에러 상태 */}
      {error && <div>에러 발생: {error.message}</div>}
      
      {/* 데이터 표시 */}
      {categories && (
        <ul>
          {categories.map((category: any) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      )}
      
      {/* 수동 호출 버튼 */}
      <button onClick={() => fetchProjects()}>프로젝트 불러오기</button>
      
      {/* 생성 버튼 */}
      <button onClick={handleCreateProject} disabled={creating}>
        {creating ? '생성 중...' : '프로젝트 생성'}
      </button>
    </div>
  );
}