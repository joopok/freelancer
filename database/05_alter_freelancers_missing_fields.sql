-- ===================================================================
-- Add missing fields to freelancers table for frontend compatibility
-- ===================================================================

USE jobtracker;

-- Add missing columns if they don't exist
ALTER TABLE freelancers 
ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0 COMMENT '조회수',
ADD COLUMN IF NOT EXISTS type ENUM('개인', '팀', '법인사업자') DEFAULT '개인' COMMENT '프리랜서 타입',
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT '기타' COMMENT '전문 분야 카테고리',
ADD COLUMN IF NOT EXISTS name VARCHAR(100) COMMENT '프리랜서 이름 (users.full_name과 동기화)';

-- Add indexes for new columns
ALTER TABLE freelancers 
ADD INDEX IF NOT EXISTS idx_view_count (view_count DESC),
ADD INDEX IF NOT EXISTS idx_type (type),
ADD INDEX IF NOT EXISTS idx_category (category);

-- Update existing data with default values
UPDATE freelancers SET 
  view_count = FLOOR(RAND() * 1000) + 1 WHERE view_count = 0;

UPDATE freelancers f
JOIN users u ON f.user_id = u.id 
SET f.name = u.full_name 
WHERE f.name IS NULL;

-- Set random types for existing freelancers
UPDATE freelancers SET 
  type = CASE 
    WHEN RAND() < 0.7 THEN '개인'
    WHEN RAND() < 0.9 THEN '팀'
    ELSE '법인사업자'
  END
WHERE type = '개인';

-- Set categories based on title keywords
UPDATE freelancers SET 
  category = CASE 
    WHEN title LIKE '%개발%' OR title LIKE '%프로그래머%' OR title LIKE '%엔지니어%' THEN '개발자'
    WHEN title LIKE '%디자인%' OR title LIKE '%UI%' OR title LIKE '%UX%' THEN '디자이너'
    WHEN title LIKE '%기획%' OR title LIKE '%PM%' OR title LIKE '%매니저%' THEN '기획자'
    WHEN title LIKE '%퍼블리셔%' OR title LIKE '%HTML%' OR title LIKE '%CSS%' THEN '퍼블리셔'
    WHEN title LIKE '%PM%' OR title LIKE '%PL%' THEN 'PM/PL'
    WHEN title LIKE '%PMO%' THEN 'PMO'
    ELSE '기타'
  END
WHERE category = '기타';

-- Verify the changes
SELECT 
  COUNT(*) as total_freelancers,
  COUNT(CASE WHEN view_count > 0 THEN 1 END) as with_view_count,
  COUNT(CASE WHEN type IS NOT NULL THEN 1 END) as with_type,
  COUNT(CASE WHEN category IS NOT NULL THEN 1 END) as with_category,
  COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as with_name
FROM freelancers;

-- Show sample data
SELECT 
  id, name, type, category, view_count, completed_projects, rating, title
FROM freelancers 
LIMIT 5;