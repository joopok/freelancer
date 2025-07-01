import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/utils/database';
import { Freelancer } from '@/types/freelancer';

// GET /api/freelancers - 프리랜서 목록 조회
export async function GET(request: NextRequest) {
  try {
    // URL 파라미터 추출
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const skills = searchParams.get('skills') || '';
    const minRate = searchParams.get('minRate') || '';
    const maxRate = searchParams.get('maxRate') || '';

    // OFFSET 계산
    const offset = (page - 1) * limit;

    // 기본 쿼리
    let query = `
      SELECT 
        id,
        name,
        email,
        phone,
        location,
        skills,
        hourly_rate,
        experience_years,
        bio,
        portfolio_url,
        profile_image,
        availability_status,
        rating,
        completed_projects,
        created_at,
        updated_at
      FROM freelancers 
      WHERE 1=1
    `;

    const queryParams: any[] = [];

    // 검색 조건 추가
    if (search) {
      query += ` AND (name LIKE ? OR bio LIKE ? OR skills LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // 스킬 필터
    if (skills) {
      const skillList = skills.split(',').map(skill => skill.trim());
      const skillConditions = skillList.map(() => 'skills LIKE ?').join(' OR ');
      query += ` AND (${skillConditions})`;
      skillList.forEach(skill => queryParams.push(`%${skill}%`));
    }

    // 시급 범위 필터
    if (minRate) {
      query += ` AND hourly_rate >= ?`;
      queryParams.push(parseFloat(minRate));
    }

    if (maxRate) {
      query += ` AND hourly_rate <= ?`;
      queryParams.push(parseFloat(maxRate));
    }

    // 정렬 (평점 순, 완료 프로젝트 순)
    query += ` ORDER BY rating DESC, completed_projects DESC`;

    // 페이지네이션
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    console.log('🔍 Freelancer 조회 쿼리:', query);
    console.log('📋 쿼리 파라미터:', queryParams);

    // 데이터 조회
    const freelancers = await executeQuery<Freelancer>(query, queryParams);

    // 전체 개수 조회 (페이지네이션용)
    let countQuery = `SELECT COUNT(*) as total FROM freelancers WHERE 1=1`;
    const countParams: any[] = [];

    // 같은 조건으로 개수 계산
    if (search) {
      countQuery += ` AND (name LIKE ? OR bio LIKE ? OR skills LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (skills) {
      const skillList = skills.split(',').map(skill => skill.trim());
      const skillConditions = skillList.map(() => 'skills LIKE ?').join(' OR ');
      countQuery += ` AND (${skillConditions})`;
      skillList.forEach(skill => countParams.push(`%${skill}%`));
    }

    if (minRate) {
      countQuery += ` AND hourly_rate >= ?`;
      countParams.push(parseFloat(minRate));
    }

    if (maxRate) {
      countQuery += ` AND hourly_rate <= ?`;
      countParams.push(parseFloat(maxRate));
    }

    const countResult = await executeQuery<{ total: number }>(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    // 스킬 문자열을 배열로 변환
    const processedFreelancers = freelancers.map((freelancer: Freelancer) => ({
      ...freelancer,
      skills: typeof (freelancer.skills as any) === 'string' 
        ? (freelancer.skills as any).split(',').map((skill: string) => skill.trim()).filter(Boolean)
        : [] // skills가 문자열이 아니면 빈 배열로 처리
    }));

    console.log(`✅ ${processedFreelancers.length}명의 프리랜서 조회 완료 (전체: ${total}명)`);

    return NextResponse.json({
      success: true,
      data: {
        freelancers: processedFreelancers,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
      pagination: { // 기존 pagination 정보도 유지 (혹은 data 객체와 통합)
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('❌ 프리랜서 조회 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '프리랜서 목록을 가져오는데 실패했습니다.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
} 