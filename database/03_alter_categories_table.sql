-- parent_id 컬럼 추가 (Spring Boot 프로젝트와 일치시키기 위해)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS parent_id VARCHAR(50) COMMENT '상위 카테고리 ID' AFTER color_secondary;