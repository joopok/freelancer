-- categories 테이블의 image_url 필드 업데이트
UPDATE categories SET image_url = 
  CASE slug
    WHEN 'web-development' THEN '/images/category-web.jpg'
    WHEN 'app-development' THEN '/images/category-app.jpg'
    WHEN 'design' THEN '/images/category-design.jpg'
    WHEN 'marketing' THEN '/images/category-marketing.jpg'
    WHEN 'content-creation' THEN '/images/category-content.jpg'
    WHEN 'planning-pm' THEN '/images/category-planning.jpg'
    WHEN 'data-analysis' THEN '/images/category-data.jpg'
    WHEN 'ai-ml' THEN '/images/category-ai.jpg'
    WHEN 'blockchain' THEN '/images/category-blockchain.jpg'
    WHEN 'game-development' THEN '/images/category-game.jpg'
    ELSE '/images/category-default.jpg'
  END
WHERE image_url IS NULL OR image_url = '';