\c
craig_nc_knews_test;

SELECT topics.slug, topics.description, COUNT(articles.topic)
FROM topics
  JOIN articles
  ON topics.slug = articles.topic
GROUP BY topics.slug
ORDER BY topics.slug DESC
;
