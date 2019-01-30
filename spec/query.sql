\c
craig_nc_knews_test;

SELECT comment_id, article_id
FROM comments
WHERE comments.comment_id = 1
  AND comments.article_id = 9;

-- SELECT *
-- FROM articles
--   JOIN comments
--   ON articles.article_id = comments.article_id
-- ;


-- SELECT topics.slug, topics.description, COUNT(articles.topic)
-- FROM topics
--   JOIN articles
--   ON topics.slug = articles.topic
-- GROUP BY topics.slug
-- ORDER BY topics.slug DESC;
