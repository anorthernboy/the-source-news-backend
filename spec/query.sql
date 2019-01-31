\c
craig_nc_knews_test;

SELECT *
FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id;
--   LEFT JOIN comments
--   ON articles.article_id = comments.article_id
-- WHERE articles
-- .topic = 'mitch'
-- ORDER BY articles.created_at DESC
-- LIMIT 10;


-- SELECT articles.username, articles.title, articles.article_id, articles.votes, COUNT(comments.article_id) AS comment_count, articles.created_at, articles.topic
-- FROM articles
--   JOIN comments
--   ON articles.article_id = comments.article_id
-- GROUP BY articles.topic
-- ORDER BY articles.created_at DESC;
