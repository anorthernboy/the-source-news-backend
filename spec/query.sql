\c
craig_nc_knews_test;

SELECT articles.title, articles.topic, articles.username, articles.created_at
FROM articles
  LEFT JOIN users
  ON articles.username = users.username
WHERE articles
.username = 'icellusedkars'
ORDER BY articles.created_at ASC
LIMIT 10
;


-- SELECT topics.slug, topics.description, COUNT(articles.topic)
-- FROM topics
--   JOIN articles
--   ON topics.slug = articles.topic
-- GROUP BY topics.slug
-- ORDER BY topics.slug DESC;
