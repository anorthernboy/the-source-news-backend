// MODEL WITH LIMIT QUERY & SORT BY QUERY
exports.fetchTopics = ({
  limit = 10,
  sort_by = 'slug',
  sort_criteria = 'DESC',
}) => {
  return connection
    .select('topics.slug', 'topics.description')
    .count('articles.topic as article_count')
    .leftJoin('articles', 'topics.slug', '=', 'articles.topic')
    .from('topics')
    .limit(limit)
    .groupBy('topics.slug')
    .orderBy(sort_by, sort_criteria);
};


// CONTROLLER WITH LIMIT QUERY & SORT BY QUERY
exports.getTopics = (req, res, next) => {

  const {
    limit,
    sort_by,
    sort_criteria,
  } = req.query;

  fetchTopics(limit,
      sort_by,
      sort_criteria)
    .then(topics =>
      res.status(200).json({
        topics
      })
    )
    .catch(next);
};


// EXAMPLE TESTING QUERIES - LIMIT //

it("GET response:200 and an array of 10 objects [DEFAULT CASE]", () => {
  return request
    .get("/api/topics")
    .expect(200)
    .then(({
      body
    }) => {
      expect(body.topics).to.have.length(10)
    })
})

it("GET response:200 and an array of 5 objects [QUERY CASE]", () => {
  return request
    .get("/api/topics?limit=5")
    .expect(200)
    .then(({
      body
    }) => {
      expect(body.topics).to.have.length(5)
    })
})

it("GET response status:200 and will sort by topic slug [DEFAULT CASE] [DEFAULT DESC]", () => {
  return request
    .get("/api/topics")
    .expect(200)
    .then(({
      body
    }) => {
      expect(body.topics[0].slug).to.equal("mitch");
      expect(body.topics[1].slug).to.equal("cats");
    })
})

it("GET response status:200 and will sort by description [DEFAULT DESC]", () => {
  return request
    .get("/api/topics?sort_by=description")
    .expect(200)
    .then(({
      body
    }) => {
      expect(body.topics[0].slug).to.equal("mitch");
      expect(body.topics[1].slug).to.equal("cats");
    })
})

it("GET response status:200 and will sort by description and ASC", () => {
  return request
    .get("/api/topics?sort_by=description&sort_criteria=ASC")
    .expect(200)
    .then(({
      body
    }) => {
      expect(body.topics[0].slug).to.equal("cats");
      expect(body.topics[1].slug).to.equal("mitch");
    })
})

it("GET response status:200 and each topic has an article count property", () => {
  return request
    .get("/api/topics")
    .expect(200)
    .then(({
      body
    }) => {
      expect(body.topics[0].name).to.equal("mitch");
      expect(body.topics[0].article_count).to.equal("11");
    })
})