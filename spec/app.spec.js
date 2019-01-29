process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const {
  expect
} = require('chai');
const connection = require('../db/connection');

describe('/api', () => {

  beforeEach(() => {
    return connection.migrate.rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run())
  })

  after(() => connection.destroy());

  describe('/topics', () => {

    it('GET response status:200 and an array of topic objects', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.topics).to.be.an('array');
          expect(body.topics[0]).to.contains.keys('description', 'slug')
        });
    });

  });


  describe('/users', () => {

    it('GET response status:200 and an array of user objects', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.users).to.be.an('array');
          expect(body.users[0]).to.contains.keys('username', 'name', 'avatar_url')
        });
    });

  });


  describe('/articles', () => {

    it('GET response status:200 and an array of article objects', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contains.keys('article_id', 'title', 'body', 'votes', 'topic', 'username', 'created_at')
        });
    });

  });


  describe('/comments', () => {

    it('GET response status:200 and an array of comment objects', () => {
      return request
        .get('/api/comments')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments[0]).to.contains.keys('comment_id', 'username', 'article_id', 'votes', 'created_at', 'body')
        });
    });
  });

})