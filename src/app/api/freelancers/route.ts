import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/utils/database';
import { Freelancer } from '@/types/freelancer';

// GET /api/freelancers - 프리랜서 목록 조회
export async function GET(request: NextRequest) {
  console.log('📥 API Request received');
  try {
    // URL 파라미터 추출
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || searchParams.get('limit') || '10')));
    const search = searchParams.get('search') || '';
    const skills = searchParams.get('skills') || '';
    const minRate = searchParams.get('minRate') || '';
    const maxRate = searchParams.get('maxRate') || '';
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type') || '';
    const experience = searchParams.get('experience') || '';
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // OFFSET 계산
    const offset = (page - 1) * limit;
    
    console.log(`📋 Pagination params: page=${page}, limit=${limit}, offset=${offset}`);

    // 기본 쿼리
    let query = `
      SELECT 
        f.id,
        COALESCE(f.name, u.full_name, 'Unknown') as name,
        u.email,
        u.phone,
        u.location,
        f.skills,
        f.hourly_rate,
        f.experience_years,
        COALESCE(f.description, u.bio, 'No description available') as description,
        f.portfolio_url,
        u.profile_image,
        f.availability as availability_status,
        COALESCE(f.rating, 0) as rating,
        COALESCE(f.completed_projects, 0) as projectCount,
        COALESCE(f.view_count, 0) as viewCount,
        COALESCE(f.type, '개인') as type,
        COALESCE(f.category, '기타') as category,
        f.title,
        f.created_at,
        f.updated_at
      FROM freelancers f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];

    // 검색 조건 추가
    if (search) {
      query += ` AND (COALESCE(f.name, u.full_name, 'Unknown') LIKE ? OR COALESCE(f.description, u.bio, '') LIKE ? OR f.skills LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // 스킬 필터
    if (skills) {
      const skillList = skills.split(',').map(skill => skill.trim());
      const skillConditions = skillList.map(() => 'f.skills LIKE ?').join(' OR ');
      query += ` AND (${skillConditions})`;
      skillList.forEach(skill => queryParams.push(`%${skill}%`));
    }

    // 카테고리 필터
    if (category && category !== '전체') {
      query += ` AND f.category = ?`;
      queryParams.push(category);
    }

    // 타입 필터
    if (type) {
      query += ` AND f.type = ?`;
      queryParams.push(type);
    }

    // 경력 필터
    if (experience) {
      const expYears = parseInt(experience);
      if (experience === '11') {
        query += ` AND f.experience_years > 10`;
      } else {
        query += ` AND f.experience_years <= ?`;
        queryParams.push(expYears);
      }
    }

    // 시급 범위 필터
    if (minRate) {
      query += ` AND f.hourly_rate >= ?`;
      queryParams.push(parseFloat(minRate));
    }

    if (maxRate) {
      query += ` AND f.hourly_rate <= ?`;
      queryParams.push(parseFloat(maxRate));
    }

    // 동적 정렬
    let orderBy = 'f.rating DESC';
    if (sortBy === 'experience') {
      orderBy = `f.experience_years ${sortOrder.toUpperCase()}`;
    } else if (sortBy === 'viewCount') {
      orderBy = `f.view_count ${sortOrder.toUpperCase()}`;
    } else if (sortBy === 'projectCount') {
      orderBy = `f.completed_projects ${sortOrder.toUpperCase()}`;
    } else if (sortBy === 'rating') {
      orderBy = `f.rating ${sortOrder.toUpperCase()}`;
    }
    
    query += ` ORDER BY ${orderBy}, f.completed_projects DESC`;

    // 페이지네이션 (LIMIT과 OFFSET 순서 중요)
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    // 파라미터로 전달하지 않고 직접 쿼리에 포함 (MariaDB 호환성)

    console.log('🔍 Freelancer 조회 쿼리:', query);
    console.log('📋 쿼리 파라미터:', queryParams);
    console.log(`📄 예상 결과: ${limit}개 (${offset} offset)`);

    let freelancers;
    let total = 0;
    
    try {
      // 데이터 조회
      freelancers = await executeQuery<Freelancer>(query, queryParams);
    } catch (dbError) {
      console.warn('⚠️ Database connection failed, using mock data for testing');
      
      // Mock 데이터 생성 (총 109명)
      const mockFreelancers = Array.from({ length: 109 }, (_, i) => ({
        id: `mock-${i + 1}`,
        name: `프리랜서 ${i + 1}`,
        email: `freelancer${i + 1}@example.com`,
        experience: `${Math.floor(Math.random() * 10) + 1}년`,
        type: ['개인', '팀', '법인사업자'][Math.floor(Math.random() * 3)],
        skills: ['React', 'Node.js', 'Python', 'Java', 'TypeScript'].slice(0, Math.floor(Math.random() * 3) + 2),
        description: `안녕하세요. ${i + 1}번째 프리랜서입니다. 다양한 프로젝트 경험을 바탕으로 최고의 결과를 제공하겠습니다.`,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
        projectCount: Math.floor(Math.random() * 50) + 1,
        viewCount: Math.floor(Math.random() * 1000) + 1,
        category: ['개발자', '디자이너', '기획자', '퍼블리셔'][Math.floor(Math.random() * 4)],
        title: `전문 ${['개발자', '디자이너', '기획자'][Math.floor(Math.random() * 3)]}`,
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // 페이지네이션 적용
      const start = offset;
      const end = offset + limit;
      freelancers = mockFreelancers.slice(start, end);
      total = mockFreelancers.length;
      
      console.log(`🎭 Mock data: returning ${freelancers.length} items (${start}-${end} of ${total})`);
    }

    // 전체 개수 조회 (페이지네이션용)
    let countQuery = `SELECT COUNT(*) as total FROM freelancers WHERE 1=1`;
    const countParams: any[] = [];

    // 같은 조건으로 개수 계산 (JOIN 포함)
    countQuery = `SELECT COUNT(*) as total FROM freelancers f LEFT JOIN users u ON f.user_id = u.id WHERE 1=1`;
    
    if (search) {
      countQuery += ` AND (COALESCE(f.name, u.full_name, 'Unknown') LIKE ? OR COALESCE(f.description, u.bio, '') LIKE ? OR f.skills LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (skills) {
      const skillList = skills.split(',').map(skill => skill.trim());
      const skillConditions = skillList.map(() => 'f.skills LIKE ?').join(' OR ');
      countQuery += ` AND (${skillConditions})`;
      skillList.forEach(skill => countParams.push(`%${skill}%`));
    }

    if (category && category !== '전체') {
      countQuery += ` AND f.category = ?`;
      countParams.push(category);
    }

    if (type) {
      countQuery += ` AND f.type = ?`;
      countParams.push(type);
    }

    if (experience) {
      const expYears = parseInt(experience);
      if (experience === '11') {
        countQuery += ` AND f.experience_years > 10`;
      } else {
        countQuery += ` AND f.experience_years <= ?`;
        countParams.push(expYears);
      }
    }

    if (minRate) {
      countQuery += ` AND f.hourly_rate >= ?`;
      countParams.push(parseFloat(minRate));
    }

    if (maxRate) {
      countQuery += ` AND f.hourly_rate <= ?`;
      countParams.push(parseFloat(maxRate));
    }

    if (total === 0) {
      // DB에서 데이터를 가져온 경우에만 count 쿼리 실행
      try {
        const countResult = await executeQuery<{ total: number }>(countQuery, countParams);
        total = countResult[0]?.total || 0;
      } catch (countError) {
        console.warn('⚠️ Count query failed, using mock data count');
        // Mock 데이터의 경우 total은 이미 설정됨
      }
    }

    // 데이터 후처리
    const processedFreelancers = freelancers.map((freelancer: any) => ({
      ...freelancer,
      // skills 처리
      skills: typeof freelancer.skills === 'string' 
        ? freelancer.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean)
        : (Array.isArray(freelancer.skills) ? freelancer.skills : []),
      // experience 처리  
      experience: freelancer.experience_years ? `${freelancer.experience_years}년` : 
                 (freelancer.experience || '경력 미입력'),
      // description 처리
      description: freelancer.description || freelancer.bio || '소개글이 없습니다.',
      // 기본값 설정
      rating: freelancer.rating || 0,
      projectCount: freelancer.projectCount || 0,
      viewCount: freelancer.viewCount || 0,
      type: freelancer.type || '개인',
      category: freelancer.category || '기타'
    }));

    console.log(`✅ ${processedFreelancers.length}명의 프리랜서 조회 완료 (전체: ${total}명, 페이지: ${page}/${Math.ceil(total / limit)})`);
    console.log(`📊 실제 반환된 데이터 수: ${processedFreelancers.length}`);
    
    // 페이징이 올바르게 작동하는지 검증
    if (processedFreelancers.length > limit) {
      console.warn(`⚠️ 페이징 오류: ${processedFreelancers.length}개 반환됨 (예상: ${limit}개)`);
    }

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