process.env.NODE_ENV = 'test';

const {
  expect,
} = require('chai');

const supertest = require('supertest');

const app = require('../app');

const request = supertest(app);

const connection = require('../db/connection');

const {
  createRef,
  createArticleRef,
  createTime,
  formatArticles,
  formatComments,
} = require('../db/utils/index');

describe('/utils', () => {
  describe('/createRef()', () => {
    it('returns an empty object for an empty array', () => {
      expect(createRef([], 'col1')).to.eql({});
    });
    it('returns an empty object when less than no column parameter passed', () => {
      expect(createRef([1, 2, 3, 4])).to.eql({});
    });
    it('returns correct object when all parameters passed', () => {
      expect(createRef([{
        article_id: 1,
        title: 'The vegan carnivore?',
      }, {
        article_id: 2,
        title: 'Meat is murder!',
      }, {
        article_id: 3,
        title: 'Bring home the beans!',
      }], 'title')).to.eql({
        'Bring home the beans!': 'Bring home the beans!',
        'Meat is murder!': 'Meat is murder!',
        'The vegan carnivore?': 'The vegan carnivore?',
      });
    });
  });

  describe('/createArticleRef()', () => {
    it('returns an empty object for an empty array', () => {
      expect(createArticleRef([], 'col1', 'col2')).to.eql({});
    });
    it('returns an empty object when less than two column parameters passed', () => {
      expect(createArticleRef([1, 2, 3, 4])).to.eql({});
      expect(createArticleRef([1, 2, 3, 4], 'col1')).to.eql({});
    });
    it('returns correct object when all parameters passed', () => {
      expect(createArticleRef([{
        article_id: 1,
        title: 'The vegan carnivore?',
      }, {
        article_id: 2,
        title: 'Meat is murder!',
      }, {
        article_id: 3,
        title: 'Bring home the beans!',
      }], 'title', 'article_id')).to.eql({
        'Bring home the beans!': 3,
        'Meat is murder!': 2,
        'The vegan carnivore?': 1,
      });
    });
  });

  describe('/createTime()', () => {
    it('returns the correct date for timestamp', () => {
      expect(createTime(998976548899)).to.equal('Tue Aug 28 2001');
    });
    it('returns the "invalid date" for out of range timestamp', () => {
      expect(createTime(11111111111111111111)).to.equal('Invalid Date');
    });
    it('returns the Unix Epoch for negative timestamp', () => {
      expect(createTime(-24567)).to.equal('Thu Jan 01 1970');
    });
  });

  describe('/formatArticles()', () => {
    it('does something...', () => {
      expect(formatArticles()).to.eql();
    });
  });

  describe('/formatComments()', () => {
    it('does something...', () => {
      expect(formatComments()).to.eql();
    });
  });
});

describe('/api', () => {
  // before each mocha hook ensure database is stripped down and built up
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));

  // after each mocha hook ensure connection is not left hanging
  after(() => connection.destroy());

  //                  //
  //                  //
  //  TOPICS ROUTER   //
  //                  //
  //                  //

  describe('/topics', () => {
    describe('getTopics()', () => {
      it('GET response status:200 and an array of topic objects', () => request
        .get('/api/topics')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.topics).to.be.an('array');
          expect(body.topics[0]).to.contains.keys('description', 'slug');
        }));

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
    });

    describe('addTopic()', () => {
      it('POST response status:201 and the new topic object', () => {
        const newTopic = {
          slug: 'joystick',
          description: 'wreck pastel slip snail meadow upset consumption',
        };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(201)
          .then(({
            body,
          }) => {
            expect(body.topic).to.be.an('array');
            expect(body.topic[0].slug).to.equal('joystick');
            expect(body.topic[0]).to.contains.keys('description', 'slug');
          });
      });
    });

    describe('getArticlesByTopic()', () => {
      it('GET response status:200 and an array of article objects for the topic', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0].topic).to.equal('mitch');
          expect(body.articles[0]).to.contains.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'username',
            'created_at',
          );
        }));

      it('GET response status:200 and an array of 10 article objects for the topic [DEFAULT CASE]', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(10);
        }));

      it('GET response status:200 and an array of 5 article objects for the topic [QUERY CASE]', () => request
        .get('/api/topics/mitch/articles?limit=5')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(5);
        }));

      it('GET response status:200 and an array of 10 article objects for the topic sorted by date created [DEFAULT CASE] [DEFAULT DESC]', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal(
            'Living in the shadow of a great man',
          );
        }));

      it('GET response status:200 and an array of 10 article objects for the topic sorted by title [QUERY CASE] [DEFAULT DESC]', () => request
        .get('/api/topics/mitch/articles?sort_by=title')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Z');
        }));

      it('GET response status:200 and an array of 10 article objects for the topic sorted by date created [DEFAULT CASE] and ASC [QUERY CASE]', () => request
        .get('/api/topics/mitch/articles?order=ASC')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Moustache');
        }));
    });

    describe('addArticleByTopic()', () => {
      it('POST response status:201 and the new article object', () => {
        const newArticle = {
          title: 'FA investigates allegations of homophobic chanting at Sol Campbell',
          body: "The Football Association has launched an investigation into claims Sol Campbell was subjected to homophobic abuse during Macclesfield’s visit to Cheltenham on Saturday. It comes after several Cheltenham fans wrote about chants directed towards the away manager on social media after the match, which the home side won 3 - 2. One supporter tweeted that 'the homophobic chants and references towards Sol Campbell were disgusting. Disappointed the stewards didn’t seem to do anything.' Another said: 'It was horrendous. And not for the first time this season. Cheltenham need to nip it before it happens again.'",
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/mitch/articles')
          .send(newArticle)
          .expect(201)
          .then(({
            body,
          }) => {
            expect(body.article).to.be.an('array');
            expect(body.article[0].topic).to.equal('mitch');
            expect(body.article[0]).to.contains.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'username',
              'created_at',
            );
          });
      });
    });
  });

  //                  //
  //                  //
  //   USERS ROUTER   //
  //                  //
  //                  //

  describe('/users', () => {
    describe('getUsers()', () => {
      it('GET response status:200 and an array of user objects', () => request
        .get('/api/users')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.users).to.be.an('array');
          expect(body.users[0]).to.contains.keys(
            'username',
            'name',
            'avatar_url',
          );
        }));

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
    });

    describe('addUser()', () => {
      it('POST response status:201 and the new user object', () => {
        const newUser = {
          username: 'stilton_01',
          avatar_url: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjg34fngpTgAhXvzoUKHRazDl4QjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FStilton_cheese&psig=AOvVaw15ktD8EaV9Tuerl1iw3MoP&ust=1548886717641327',
          name: 'leon',
        };
        return request
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .then(({
            body,
          }) => {
            expect(body.user).to.be.an('array');
            expect(body.user[0].username).to.equal('stilton_01');
            expect(body.user[0]).to.contains.keys(
              'username',
              'name',
              'avatar_url',
            );
          });
      });
    });

    describe('getUserByUsername()', () => {
      it('GET response status:200 and a user object for the username', () => request
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.user).to.be.an('array');
          expect(body.user[0].username).to.equal('butter_bridge');
          expect(body.user[0]).to.contains.keys(
            'username',
            'name',
            'avatar_url',
          );
        }));
    });

    describe('getArticlesByUsername()', () => {
      it('GET response status:200 and an array of articles for the username', () => request
        .get('/api/users/butter_bridge/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0].username).to.equal('butter_bridge');
          expect(body.articles[0]).to.contains.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'username',
            'created_at',
          );
        }));

      it('GET response status:200 and an array of 5 article objects for the username [DEFAULT CASE]', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(5);
        }));

      it('GET response status:200 and an array of 2 article objects for the username [QUERY CASE]', () => request
        .get('/api/users/icellusedkars/articles?limit=2')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(2);
        }));

      it('GET response status:200 and an array of 5 article objects for the username sorted by date created [DEFAULT CASE] [DEFAULT DESC]', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(5);
          expect(body.articles[0].username).to.equal(
            'icellusedkars',
          );
        }));

      it('GET response status:200 and an array of 5 article objects for the username sorted by title [QUERY CASE] [DEFAULT DESC]', () => request
        .get('/api/users/icellusedkars/articles?sort_by=title')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(5);
          expect(body.articles[0].title).to.equal('Z');
        }));

      it('GET response status:200 and an array of 5 article objects for the username sorted by date created [DEFAULT CASE] and ASC [QUERY CASE]', () => request
        .get('/api/users/icellusedkars/articles?order=ASC')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(5);
          expect(body.articles[0].title).to.equal('Am I a cat?');
        }));
    });
  });

  //                  //
  //                  //
  // ARTICLES ROUTER  //
  //                  //
  //                  //

  describe('/articles', () => {
    describe('getArticles()', () => {
      it('GET response status:200 and an array of article objects', () => request
        .get('/api/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contains.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'username',
            'created_at',
          );
        }));

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

      it('GET response status:200 and an array of 10 article objects for the topic [DEFAULT CASE]', () => request
        .get('/api/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(10);
        }));

      it('GET response status:200 and an array of 5 article objects for the topic [QUERY CASE]', () => request
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(5);
        }));

      it('GET response status:200 and an array of 10 article objects for the topic sorted by date created [DEFAULT CASE] [DEFAULT DESC]', () => request
        .get('/api/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal(
            'Living in the shadow of a great man',
          );
        }));

      it('GET response status:200 and an array of 10 article objects for the topic sorted by title [QUERY CASE] [DEFAULT DESC]', () => request
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Z');
        }));

      it('GET response status:200 and an array of 10 article objects for the topic sorted by date created [DEFAULT CASE] and ASC [QUERY CASE]', () => request
        .get('/api/articles?order=ASC')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Moustache');
        }));
    });

    describe('getArticlesById()', () => {
      it('GET response status:200 and an array of article objects for the article_id', () => request
        .get('/api/articles/1')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.article).to.be.an('array');
          expect(body.article[0].article_id).to.equal(1);
          expect(body.article[0]).to.contains.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'username',
            'created_at',
          );
        }));
    });

    describe('patchArticleById()', () => {
      // only works where votes starting value is 0 at the moment

      it('PUT response status:200 and an updated article object for the article_id', () => {
        const updateArticle = {
          inc_votes: 10,
        };
        return request
          .put('/api/articles/2')
          .send(updateArticle)
          .expect(200)
          .then(({
            body,
          }) => {
            expect(body.article).to.be.an('array');
            expect(body.article[0].article_id).to.equal(2);
            expect(body.article[0].votes).to.equal(10);
            expect(body.article[0]).to.contains.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'username',
              'created_at',
            );
          });
      });
    });

    describe('deleteArticleById()', () => {
      it('DELETE response status:204 and no content', () => request.delete('/api/articles/1').expect(204));
    });

    describe('getCommentsByArticleId()', () => {
      it('GET response status:200 and an array of comment objects for the article_id', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments[0].article_id).to.equal(1);
          expect(body.comments[0]).to.contains.keys(
            'comment_id',
            'username',
            'article_id',
            'votes',
            'created_at',
            'body',
          );
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id [DEFAULT CASE]', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments).to.have.length(10);
        }));

      it('GET response status:200 and an array of 5 comment objects for the article_id [QUERY CASE]', () => request
        .get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments).to.have.length(5);
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id sorted by date created [DEFAULT CASE] [DEFAULT DESC]', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments).to.have.length(10);
          expect(body.comments[0].username).to.equal(
            'butter_bridge',
          );
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id sorted by username [QUERY CASE] [DEFAULT DESC]', () => request
        .get('/api/articles/1/comments?sort_by=username')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments).to.have.length(10);
          expect(body.comments[0].username).to.equal('icellusedkars');
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id sorted by date created [DEFAULT CASE] and ASC [QUERY CASE]', () => request
        .get('/api/articles/1/comments?order=ASC')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments).to.have.length(10);
          expect(body.comments[0].username).to.equal('butter_bridge');
        }));
    });

    describe('addCommentByArticleId()', () => {
      it('POST response status:201 and the new comment object', () => {
        const newComment = {
          body: 'Thanks very much Newcastle United for making an awful Brexit day a wee bit better.',
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles/2/comments')
          .send(newComment)
          .expect(201)
          .then(({
            body,
          }) => {
            expect(body.comment).to.be.an('array');
            expect(body.comment[0].article_id).to.equal(2);
            expect(body.comment[0]).to.contains.keys(
              'comment_id',
              'username',
              'article_id',
              'votes',
              'created_at',
              'body',
            );
          });
      });
    });

    describe('patchArticleCommentVoteByCommentId()', () => {
      // only works where votes starting value is 0 at the moment

      it('PUT response status:200 and an updated comment object for the comment_id', () => {
        const updateComment = {
          inc_votes: 10,
        };
        return request
          .put('/api/articles/1/comments/5')
          .send(updateComment)
          .expect(200)
          .then(({
            body,
          }) => {
            expect(body.comment).to.be.an('array');
            expect(body.comment[0].comment_id).to.equal(5);
            expect(body.comment[0].votes).to.equal(10);
            expect(body.comment[0]).to.contains.keys(
              'comment_id',
              'username',
              'article_id',
              'votes',
              'created_at',
              'body',
            );
          });
      });
    });

    describe('deleteArticleCommentByCommentId()', () => {
      it('DELETE response status:204 and no content', () => request.delete('/api/articles/9/comments/1').expect(204));
    });
  });

  //                  //
  //                  //
  // COMMENTS ROUTER  //
  //                  //
  //                  //

  describe('/comments', () => {
    describe('getComments()', () => {
      it('GET response status:200 and an array of comment objects', () => request
        .get('/api/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments[0]).to.contains.keys(
            'comment_id',
            'username',
            'article_id',
            'votes',
            'created_at',
            'body',
          );
        }));

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
    });
  });
});