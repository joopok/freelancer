-- ===================================================================
-- CATEGORIES TABLE - 프로젝트 카테고리
-- ===================================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '카테고리명',
    name_en VARCHAR(100) COMMENT '카테고리명 (영문)',
    slug VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL 슬러그',
    description TEXT COMMENT '카테고리 설명',
    icon VARCHAR(50) COMMENT '카테고리 아이콘 (이모지 또는 아이콘 클래스)',
    image_url VARCHAR(500) COMMENT '카테고리 대표 이미지 URL',
    
    -- 통계 정보
    project_count INT DEFAULT 0 COMMENT '등록된 프로젝트 수',
    active_project_count INT DEFAULT 0 COMMENT '진행중인 프로젝트 수',
    
    -- 표시 설정
    display_order INT DEFAULT 0 COMMENT '표시 순서',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '추천 카테고리 여부',
    
    -- 색상 설정 (UI용)
    color_primary VARCHAR(7) COMMENT '주 색상 (HEX)',
    color_secondary VARCHAR(7) COMMENT '보조 색상 (HEX)',
    
    parent_id VARCHAR(50) COMMENT '상위 카테고리 ID',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_active_featured (is_active, is_featured),
    INDEX idx_display_order (display_order),
    FULLTEXT idx_search (name, name_en, description)
) COMMENT='프로젝트 카테고리';

-- 초기 카테고리 데이터 삽입
INSERT INTO categories (name, name_en, slug, description, icon, display_order, is_active, is_featured) VALUES
('웹 개발', 'Web Development', 'web-development', '웹사이트 및 웹 애플리케이션 개발', '💻', 1, TRUE, TRUE),
('앱 개발', 'App Development', 'app-development', '모바일 애플리케이션 개발 (iOS/Android)', '📱', 2, TRUE, TRUE),
('디자인', 'Design', 'design', 'UI/UX, 그래픽, 브랜딩 디자인', '🎨', 3, TRUE, TRUE),
('마케팅', 'Marketing', 'marketing', '디지털 마케팅, 광고, SNS 마케팅', '📊', 4, TRUE, TRUE),
('콘텐츠 제작', 'Content Creation', 'content-creation', '블로그, 영상, 카피라이팅', '📝', 5, TRUE, TRUE),
('기획/PM', 'Planning/PM', 'planning-pm', '프로젝트 기획 및 관리', '📋', 6, TRUE, TRUE),
('데이터 분석', 'Data Analysis', 'data-analysis', '데이터 분석 및 시각화', '📈', 7, TRUE, FALSE),
('AI/머신러닝', 'AI/ML', 'ai-ml', '인공지능 및 머신러닝 개발', '🤖', 8, TRUE, FALSE),
('블록체인', 'Blockchain', 'blockchain', '블록체인 및 암호화폐 개발', '🔗', 9, TRUE, FALSE),
('게임 개발', 'Game Development', 'game-development', '게임 개발 및 디자인', '🎮', 10, TRUE, FALSE);