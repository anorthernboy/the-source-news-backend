\c
craig_nc_knews_test;

SELECT topics.slug, articles.title, articles.created_at
FROM articles LEFT JOIN topics ON topics.slug = articles.topic
ORDER BY articles.created_at ASC
LIMIT 10;


-- SELECT topics.slug, topics.description, COUNT(articles.topic)
-- FROM topics
--   JOIN articles
--   ON topics.slug = articles.topic
-- GROUP BY topics.slug
-- ORDER BY topics.slug DESC;
