process.env.NODE_ENV = 'test';
const {
  expect,
} = require('chai');
const app = require('../app');
const request = require('supertest')(app);

const connection = require('../db/connection');

describe('/api', () => {

  beforeEach(() => {
    return connection.migrate.rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run());
  });

  after(() => connection.destroy());

  describe('/topics', () => {

    it('GET response status:200 and an array of topic objects', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.topics).to.be.an('array');
          expect(body.topics[0]).to.contains.keys('description', 'slug');
        });
    });

    // it('GET response status:400 and a bad request message', () => {
    //   return request
    //     .get('/api/3')
    //     .expect(400)
    //     .then(({
    //       body,
    //     }) => {
    //       expect(body.message).to.equal('bad request');
    //     });
    // });

    // it('GET response status:404 and a not found message', () => {
    //   return request
    //     .get('/api/topic-topic')
    //     .expect(404)
    //     .then(({
    //       body,
    //     }) => {
    //       expect(body.message).to.equal('not found');
    //     });
    // });

    // it('POST response status:201 and the new topic object', () => {
    //   return request
    //     .post('/api/topics')
    //     .expect(201)
    //     .then(() => {
    //       expect({
    //         slug: 'what',
    //         description: 'not sure this will work',
    //       }).to.be.an('object');
    //     });
    // });

    it('GET response status:200 and an array of article objects for the topic', () => {
      return request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0].topic).to.equal('mitch');
          expect(body.articles[0]).to.contains.keys('article_id', 'title', 'body', 'votes', 'topic', 'username', 'created_at');
        });
    });

  });


  describe('/users', () => {

    it('GET response status:200 and an array of user objects', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.users).to.be.an('array');
          expect(body.users[0]).to.contains.keys('username', 'name', 'avatar_url');
        });
    });

    // it('GET response status:400 and a bad request message', () => {
    //   return request
    //     .get('/api/3')
    //     .expect(400)
    //     .then(({
    //       body,
    //     }) => {
    //       expect(body.message).to.equal('bad request');
    //     });
    // });

    // it('GET response status:404 and a not found message', () => {
    //   return request
    //     .get('/api/user-user')
    //     .expect(404)
    //     .then(({
    //       body,
    //     }) => {
    //       expect(body.message).to.equal('not found');
    //     });
    // });

    it('GET response status:200 and a user object for the username', () => {
      return request
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.user).to.be.an('array');
          expect(body.user[0].username).to.equal('butter_bridge');
          expect(body.user[0]).to.contains.keys('username', 'name', 'avatar_url');
        });
    });

    it('GET response status:200 and an array of articles for the username', () => {
      return request
        .get('/api/users/butter_bridge/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0].username).to.equal('butter_bridge');
          expect(body.articles[0]).to.contains.keys('article_id', 'title', 'body', 'votes', 'topic', 'username', 'created_at');
        });
    });

  });


  describe('/articles', () => {

    it('GET response status:200 and an array of article objects', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contains.keys('article_id', 'title', 'body', 'votes', 'topic', 'username', 'created_at');
        });
    });

    // it('GET response status:400 and a bad request message', () => {
    //   return request
    //     .get('/api/3')
    //     .expect(400)
    //     .then(({
    //       body,
    //     }) => {
    //       expect(body.message).to.equal('bad request');
    //     });
    // });

    // it('GET response status:404 and a not found message', () => {
    //   return request
    //     .get('/api/article-article')
    //     .expect(404)
    //     .then(({
    //       body,
    //     }) => {
    //       expect(body.message).to.equal('not found');
    //     });
    // });

    it('GET response status:200 and an array of article objects for the article_id', () => {
      return request
        .get('/api/articles/1')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.article).to.be.an('array');
          expect(body.article[0].article_id).to.equal(1);
          expect(body.article[0]).to.contains.keys('article_id', 'title', 'body', 'votes', 'topic', 'username', 'created_at');
        });
    });

    it('GET response status:200 and an array of comment objects for the article_id', () => {
      return request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments[0].article_id).to.equal(1);
          expect(body.comments[0]).to.contains.keys('comment_id', 'username', 'article_id', 'votes', 'created_at', 'body');
        });
    });

  });


  describe('/comments', () => {

    it('GET response status:200 and an array of comment objects', () => {
      return request
        .get('/api/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments[0]).to.contains.keys('comment_id', 'username', 'article_id', 'votes', 'created_at', 'body');
        });
    });
  });

  // it('GET response status:400 and a bad request message', () => {
  //   return request
  //     .get('/api/3')
  //     .expect(400)
  //     .then(({
  //       body,
  //     }) => {
  //       expect(body.message).to.equal('bad request');
  //     });
  // });

  // it('GET response status:404 and a not found message', () => {
  //   return request
  //     .get('/api/comment-comment')
  //     .expect(404)
  //     .then(({
  //       body,
  //     }) => {
  //       expect(body.message).to.equal('not found');
  //     });
  // });

})