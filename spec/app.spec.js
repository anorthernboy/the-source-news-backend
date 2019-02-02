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
  createTime,
  formatArticles,
  formatComments,
} = require('../db/utils/index');

//                  //
//                  //
//  UTILS TESTING   //
//                  //
//                  //

describe('/utils', () => {
  describe('/createRef()', () => {
    it('returns an empty object for an empty array', () => {
      expect(createRef([], 'col1', 'col2')).to.eql({});
    });

    it('returns an empty object when less than two column parameters passed', () => {
      expect(createRef([1, 2, 3, 4])).to.eql({});
      expect(createRef([1, 2, 3, 4], 'col1')).to.eql({});
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
    it('returns empty array-like object when passed empty array', () => {
      const articleData = [];
      expect(formatArticles(articleData)).to.eql([{}]);
    });

    it('returns an array-like object with updated username and created_at fields', () => {
      const articleData = [{
        title: 'Running a Node App',
        topic: 'coding',
        created_by: 'tickle122',
        body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 1471522072389,
      }, {
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'football',
        created_by: 'grumpy19',
        body: 'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: 1500584273256,
      }];
      expect(formatArticles(articleData)).to.eql([{
        title: 'Running a Node App',
        topic: 'coding',
        username: 'tickle122',
        body: 'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
        created_at: 'Thu Aug 18 2016',
      }, {
        title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: 'football',
        username: 'grumpy19',
        body: 'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
        created_at: 'Thu Jul 20 2017',
      }]);
    });
  });

  describe('/formatComments()', () => {
    it('returns empty array-like object when passed empty array', () => {
      const commentData = [];
      const articleRef = {};
      expect(formatComments(commentData, articleRef)).to.eql([{}]);
    });

    it('returns an empty array-like object when not given a reference object', () => {
      const commentData = [{
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932,
      }, {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        belongs_to: 'Making sense of Redux',
        created_by: 'grumpy19',
        votes: 7,
        created_at: 1478813209256,
      }];
      expect(formatComments(commentData)).to.eql([{}]);
    });

    it('return an array-like object with updated username and created_at fields', () => {
      const commentData = [{
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1468087638932,
      }, {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        belongs_to: 'Making sense of Redux',
        created_by: 'grumpy19',
        votes: 7,
        created_at: 1478813209256,
      }];
      const articleRef = {
        'The People Tracking Every Touch, Pass And Tackle in the World Cup': 1,
        'Making sense of Redux': 2,
      };
      expect(formatComments(commentData, articleRef)).to.eql([{
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        article_id: 1,
        username: 'tickle122',
        votes: -1,
        created_at: 'Sat Jul 09 2016',
      }, {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        article_id: 2,
        username: 'grumpy19',
        votes: 7,
        created_at: 'Thu Nov 10 2016',
      }]);
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

  describe('', () => {
    it('returns JSON describing the available endpoints on your API', () => request
      .get('/api')
      .expect(200)
      .then(({
        body,
      }) => {
        expect(body).to.be.an('object');
      }));
  });

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
            expect(body).to.be.an('object');
            expect(body.slug).to.equal('joystick');
            expect(body).to.contains.keys('description', 'slug');
          });
      });

      it('POST ERR response status:400 and bad request message when topic object is missing keys', () => {
        const newTopic = {
          description: 'wreck pastel slip snail meadow upset consumption',
        };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('POST ERR response status:422 and unable to process message when slug is not unique', () => {
        const newTopic = {
          slug: 'mitch',
          description: 'wreck pastel slip snail meadow upset consumption',
        };
        return request
          .post('/api/topics')
          .send(newTopic)
          .expect(422)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('unable to process');
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
          expect(body).to.be.an('object');
          expect(body).to.contains.keys('total_count', 'articles');
          expect(body.total_count).to.equal(16);
          expect(body.articles).to.be.an('array');
          expect(body.articles[0].comment_count).to.equal('13');
          expect(body.articles[0]).to.contains.keys(
            'article_id',
            'title',
            'votes',
            'topic',
            'author',
            'created_at',
            'comment_count',
          );
        }));

      it('GET response status:200 and an array of 10 article objects for the topic [DEFAULT CASE]', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
        }));

      it('GET response status:200 and an array of 5 article objects for the topic [QUERY CASE]', () => request
        .get('/api/topics/mitch/articles?limit=5')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(5);
        }));

      it('GET response status:200 and an array of 10 article objects for the topic sorted by date created [DEFAULT CASE] [DEFAULT DESC]', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({
          body,
        }) => {
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
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Z');
        }));

      it('GET response status:200 and an array of 10 article objects for the topic sorted by date created [DEFAULT CASE] and ASC [QUERY CASE]', () => request
        .get('/api/topics/mitch/articles?order=ASC')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Moustache');
        }));

      it('GET response status:200 and an array of 10 article objects for the topic paginated to page one [DEFAULT CASE]', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal(
            'Living in the shadow of a great man',
          );
        }));

      it('GET response status:200 and an array of 6 article objects for the topic paginated to page two [query CASE]', () => request
        .get('/api/topics/mitch/articles?p=2')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(6);
          expect(body.articles[0].title).to.equal('Am I a?');
        }));

      it('GET ERR response status:400 and a not found message for topic which does not exist', () => request
        .get('/api/topics/western_playland/articles')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      // WILL NOT PASS THROUGH ROUTER - HOW TO ERROR
      it('GET ERR response status:404 and a not found message for no topic param passed', () => request
        .get('/api/topics/articles')
        .expect(404)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('not found');
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
            expect(body).to.be.an('object');
            expect(body.topic).to.equal('mitch');
            expect(body).to.contains.keys(
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

      // WILL NOT PASS THROUGH ROUTER - HOW TO ERROR
      it('POST response status:404 and not found message for no topic param passed', () => {
        const newArticle = {
          title: 'FA investigates allegations of homophobic chanting at Sol Campbell',
          body: "The Football Association has launched an investigation into claims Sol Campbell was subjected to homophobic abuse during Macclesfield’s visit to Cheltenham on Saturday. It comes after several Cheltenham fans wrote about chants directed towards the away manager on social media after the match, which the home side won 3 - 2. One supporter tweeted that 'the homophobic chants and references towards Sol Campbell were disgusting. Disappointed the stewards didn’t seem to do anything.' Another said: 'It was horrendous. And not for the first time this season. Cheltenham need to nip it before it happens again.'",
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/articles')
          .send(newArticle)
          .expect(404)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('not found');
          });
      });

      // DOUBLE PROMISE - IS PARAM IN TOPICS.SLUG
      it('POST ERR response status:400 and bad request message for topic which does not exist', () => {
        const newArticle = {
          title: 'FA investigates allegations of homophobic chanting at Sol Campbell',
          body: "The Football Association has launched an investigation into claims Sol Campbell was subjected to homophobic abuse during Macclesfield’s visit to Cheltenham on Saturday. It comes after several Cheltenham fans wrote about chants directed towards the away manager on social media after the match, which the home side won 3 - 2. One supporter tweeted that 'the homophobic chants and references towards Sol Campbell were disgusting. Disappointed the stewards didn’t seem to do anything.' Another said: 'It was horrendous. And not for the first time this season. Cheltenham need to nip it before it happens again.'",
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/gimme_shelter/articles')
          .send(newArticle)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('POST response status:400 and a bad request message for malformed article (missing key)', () => {
        const newArticle = {
          title: 'FA investigates allegations of homophobic chanting at Sol Campbell',
          body: "The Football Association has launched an investigation into claims Sol Campbell was subjected to homophobic abuse during Macclesfield’s visit to Cheltenham on Saturday. It comes after several Cheltenham fans wrote about chants directed towards the away manager on social media after the match, which the home side won 3 - 2. One supporter tweeted that 'the homophobic chants and references towards Sol Campbell were disgusting. Disappointed the stewards didn’t seem to do anything.' Another said: 'It was horrendous. And not for the first time this season. Cheltenham need to nip it before it happens again.'",
        };
        return request
          .post('/api/topics/mitch/articles')
          .send(newArticle)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
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
            expect(body).to.be.an('object');
            expect(body.username).to.equal('stilton_01');
            expect(body).to.contains.keys(
              'username',
              'name',
              'avatar_url',
            );
          });
      });

      it('POST ERR response status:400 and bad request message when missing keys from user object', () => {
        const newUser = {
          username: 'stilton_01',
          avatar_url: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjg34fngpTgAhXvzoUKHRazDl4QjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FStilton_cheese&psig=AOvVaw15ktD8EaV9Tuerl1iw3MoP&ust=1548886717641327',
        };
        return request
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('POST ERR response status:422 and unable to process message when username is not unique', () => {
        const newUser = {
          username: 'butter_bridge',
          avatar_url: 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjg34fngpTgAhXvzoUKHRazDl4QjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FStilton_cheese&psig=AOvVaw15ktD8EaV9Tuerl1iw3MoP&ust=1548886717641327',
          name: 'leon',
        };
        return request
          .post('/api/users')
          .send(newUser)
          .expect(422)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('unable to process');
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
          expect(body).to.be.an('object');
          expect(body.username).to.equal('butter_bridge');
          expect(body).to.contains.keys(
            'username',
            'name',
            'avatar_url',
          );
        }));

      it('GET ERR response status:400 and a bad request message for username which does not exist', () => request
        .get('/api/users/chemical_genius')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));
    });

    describe('getArticlesByUsername()', () => {
      it('GET response status:200 and an array of articles for the username', () => request
        .get('/api/users/butter_bridge/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body).to.be.an('object');
          expect(body).to.contains.keys('total_count', 'articles');
          expect(body.articles).to.be.an('array');
          expect(body.articles[0].author).to.equal('butter_bridge');
          expect(body.articles[0]).to.contains.keys(
            'article_id',
            'title',
            'votes',
            'topic',
            'author',
            'created_at',
            'comment_count',
          );
        }));

      it('GET response status:200 and an array of 10 article objects for the username [DEFAULT CASE]', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
        }));

      it('GET response status:200 and an array of 2 article objects for the username [QUERY CASE]', () => request
        .get('/api/users/icellusedkars/articles?limit=2')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(2);
        }));

      it('GET response status:200 and an array of 10 article objects for the username sorted by date created [DEFAULT CASE] [DEFAULT DESC]', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].author).to.equal(
            'icellusedkars',
          );
        }));

      it('GET response status:200 and an array of 10 article objects for the username sorted by title [QUERY CASE] [DEFAULT DESC]', () => request
        .get('/api/users/icellusedkars/articles?sort_by=title')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Z');
        }));

      it('GET response status:200 and an array of 10 article objects for the username sorted by date created [DEFAULT CASE] and ASC [QUERY CASE]', () => request
        .get('/api/users/icellusedkars/articles?order=ASC')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Am I a catch?');
        }));

      it('GET response status:200 and an array of 10 article objects for the username paginated to page one [DEFAULT CASE]', () => request
        .get('/api/users/icellusedkars/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
        }));

      it('GET response status:200 and an array of 10 article objects for the username paginated to page one [QUERY CASE]', () => request
        .get('/api/users/icellusedkars/articles?p=2')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(1);
          expect(body.articles[0].title).to.equal('Am I a cat in a hat?');
        }));

      it('GET ERR response status:400 and a bad request message for username which does not exist', () => request
        .get('/api/users/chemical_genius/articles')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      // is bad request rather than not found as it routes to /api/users/:username
      it('GET ERR response status:400 and a bad request message for username not passed as param ', () => request
        .get('/api/users/articles')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
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
          expect(body).to.be.an('object');
          expect(body).to.contains.keys('total_count', 'articles');
          expect(body.total_count).to.equal(17);
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.contains.keys(
            'author',
            'title',
            'article_id',
            'body',
            'votes',
            'created_at',
            'topic',
            'comment_count',
          );
        }));

      it('GET response status:200 and an array of 10 article objects [DEFAULT CASE]', () => request
        .get('/api/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
        }));

      it('GET response status:200 and an array of 5 article objects [QUERY CASE]', () => request
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(5);
        }));

      it('GET response status:200 and an array of 10 article objects sorted by date created [DEFAULT CASE] [DEFAULT DESC]', () => request
        .get('/api/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal(
            'Living in the shadow of a great man',
          );
        }));

      it('GET response status:200 and an array of 10 article objects sorted by title [QUERY CASE] [DEFAULT DESC]', () => request
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Z');
        }));

      it('GET response status:200 and an array of 10 article objects sorted by date created [DEFAULT CASE] and ASC [QUERY CASE]', () => request
        .get('/api/articles?order=ASC')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
          expect(body.articles[0].title).to.equal('Moustache');
        }));

      it('GET response status:200 and an array of 10 article objects paginated to page one [DEFAULT CASE]', () => request
        .get('/api/articles')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(10);
        }));

      it('GET response status:200 and an array of 7 article objects paginated to page two [QUERY CASE]', () => request
        .get('/api/articles?p=2')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.articles).to.have.length(7);
          expect(body.articles[0].title).to.equal('Am I?');
        }));
    });

    describe('getArticlesById()', () => {
      it('GET response status:200 and an array of article objects for the article_id', () => request
        .get('/api/articles/1')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body).to.be.an('object');
          expect(body.article_id).to.equal(1);
          expect(body.comment_count).to.equal('13');
          expect(body).to.contains.keys(
            'article_id',
            'title',
            'body',
            'votes',
            'topic',
            'author',
            'created_at',
            'comment_count',
          );
        }));

      it('GET ERR response status:400 and a bad request message for article_id which does not exist', () => request
        .get('/api/articles/1000000')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      it('GET ERR response status:400 and a bad request message for article_id which is not a number', () => request
        .get('/api/articles/smiths_disco')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));
    });

    describe('patchArticleById()', () => {
      it('PATCH response status:200 and an updated article object for the article_id when given a positive vote', () => {
        const updateArticle = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/1')
          .send(updateArticle)
          .expect(200)
          .then(({
            body,
          }) => {
            expect(body).to.be.an('object');
            expect(body.article_id).to.equal(1);
            expect(body.votes).to.equal(110);
            expect(body).to.contains.keys(
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

      it('PATCH response status:200 and an updated article object for the article_id when given a negative vote', () => {
        const updateArticle = {
          inc_votes: -10,
        };
        return request
          .patch('/api/articles/1')
          .send(updateArticle)
          .expect(200)
          .then(({
            body,
          }) => {
            expect(body).to.be.an('object');
            expect(body.article_id).to.equal(1);
            expect(body.votes).to.equal(90);
            expect(body).to.contains.keys(
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

      it('PATCH ERR response status:400 and a bad request message for article_id which is not a number', () => {
        const updateArticle = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/the_curse')
          .send(updateArticle)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      // DOUBLE PROMISE - IS PARAM IN ARTICLES.ARTICLE_ID
      it('PATCH ERR response status:400 and a bad request message for article_id which does not exist', () => {
        const updateArticle = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/100000')
          .send(updateArticle)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('PATCH ERR response status:405 and a method not allowed message for a non-existent article_id', () => {
        const updateArticle = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles')
          .send(updateArticle)
          .expect(405)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('method not allowed');
          });
      });

      it('PATCH ERR response status:400 and a bad request message for inc_votes which is not a number', () => {
        const updateArticle = {
          inc_votes: 'flowers',
        };
        return request
          .patch('/api/articles/1')
          .send(updateArticle)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('PATCH ERR response status:400 and a bad request message for inc_votes which does not exist', () => {
        const updateArticle = {
          showers: 10,
        };
        return request
          .patch('/api/articles/1')
          .send(updateArticle)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });
    });

    describe('deleteArticleById()', () => {
      it('DELETE response status:204 and no content', () => request.delete('/api/articles/1').expect(204));

      it('DELETE ERR response status:400 and a bad request message for article_id which is not a number', () => request
        .delete('/api/articles/the_curse')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      it('DELETE ERR response status:405 and a method not allowed message for a non-existent article_id param', () => request
        .delete('/api/articles')
        .expect(405)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('method not allowed');
        }));
    });

    describe('getCommentsByArticleId()', () => {
      it('GET response status:200 and an array of comment objects for the article_id', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.be.an('array');
          expect(body.comments[0]).to.contains.keys(
            'comment_id',
            'author',
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
          expect(body.comments).to.have.length(10);
        }));

      it('GET response status:200 and an array of 5 comment objects for the article_id [QUERY CASE]', () => request
        .get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.have.length(5);
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id sorted by date created [DEFAULT CASE] [DEFAULT DESC]', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.have.length(10);
          expect(body.comments[0].author).to.equal(
            'butter_bridge',
          );
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id sorted by username [QUERY CASE] [DEFAULT DESC]', () => request
        .get('/api/articles/1/comments?sort_by=username')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.have.length(10);
          expect(body.comments[0].author).to.equal('icellusedkars');
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id sorted by date created [DEFAULT CASE] and ASC [QUERY CASE]', () => request
        .get('/api/articles/1/comments?order=ASC')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.have.length(10);
          expect(body.comments[0].author).to.equal('butter_bridge');
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id paginated to page one [DEFAULT CASE]', () => request
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.have.length(10);
        }));

      it('GET response status:200 and an array of 10 comment objects for the article_id paginated to page two [QUERY CASE]', () => request
        .get('/api/articles/1/comments?p=2')
        .expect(200)
        .then(({
          body,
        }) => {
          expect(body.comments).to.have.length(3);
          expect(body.comments[0].author).to.equal('icellusedkars');
        }));

      it('GET ERR response status:400 and a bad request message for article_id which does not exist', () => request
        .get('/api/articles/1000000/comments')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      it('GET ERR response status:400 and a bad request message for article_id which is not a number', () => request
        .get('/api/articles/smiths_disco/comments')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
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
            expect(body).to.be.an('object');
            expect(body.article_id).to.equal(2);
            expect(body).to.contains.keys(
              'comment_id',
              'username',
              'article_id',
              'votes',
              'created_at',
              'body',
            );
          });
      });

      it('POST ERR response status:400 and a bad request message for malformed comment object (missing key)', () => {
        const newComment = {
          body: 'Thanks very much Newcastle United for making an awful Brexit day a wee bit better.',
        };
        return request
          .post('/api/articles/2/comments')
          .send(newComment)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('POST ERR response status:400 and a bad request message for article_id which is not a number', () => {
        const newComment = {
          body: 'Thanks very much Newcastle United for making an awful Brexit day a wee bit better.',
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles/smiths_disco/comments')
          .send(newComment)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('POST ERR response status:400 and a bad request message for article_id which does not exist', () => {
        const newComment = {
          body: 'Thanks very much Newcastle United for making an awful Brexit day a wee bit better.',
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles/1000000/comments')
          .send(newComment)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      // is method not allowed rather than not found as it routes to /api/articles/:article_id which does not accept POST requests
      it('POST ERR response status:405 and a method not allowed message for no article_id param', () => {
        const newComment = {
          body: 'Thanks very much Newcastle United for making an awful Brexit day a wee bit better.',
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles/comments')
          .send(newComment)
          .expect(405)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('method not allowed');
          });
      });
    });

    describe('patchArticleCommentVoteByCommentId()', () => {
      it('PATCH response status:200 and an updated comment object for the comment_id for a positive vote', () => {
        const updateComment = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/9/comments/1')
          .send(updateComment)
          .expect(200)
          .then(({
            body,
          }) => {
            expect(body).to.be.an('object');
            expect(body.comment_id).to.equal(1);
            expect(body.article_id).to.equal(9);
            expect(body.votes).to.equal(26);
            expect(body).to.contains.keys(
              'comment_id',
              'username',
              'article_id',
              'votes',
              'created_at',
              'body',
            );
          });
      });

      it('PATCH response status:200 and an updated comment object for the comment_id for a negative vote', () => {
        const updateComment = {
          inc_votes: -10,
        };
        return request
          .patch('/api/articles/9/comments/1')
          .send(updateComment)
          .expect(200)
          .then(({
            body,
          }) => {
            expect(body).to.be.an('object');
            expect(body.comment_id).to.equal(1);
            expect(body.article_id).to.equal(9);
            expect(body.votes).to.equal(6);
            expect(body).to.contains.keys(
              'comment_id',
              'username',
              'article_id',
              'votes',
              'created_at',
              'body',
            );
          });
      });

      it('PATCH ERR response status:400 and a bad request message for inc_votes which is not a number', () => {
        const updateArticle = {
          inc_votes: 'flowers',
        };
        return request
          .patch('/api/articles/9/comments/1')
          .send(updateArticle)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('PATCH ERR response status:400 and a bad request message for inc_votes which does not exist', () => {
        const updateArticle = {
          showers: 10,
        };
        return request
          .patch('/api/articles/9/comments/1')
          .send(updateArticle)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('PATCH ERR response status:400 and a bad request message for comment_id which is not a number', () => {
        const updateComment = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/9/comments/smiths_disco')
          .send(updateComment)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      // DOUBLE PROMISE - IS PARAM IN COMMENTS.COMMENT_ID
      it('PATCH ERR response status:400 and a bad request message for comment_id which does not exist', () => {
        const updateComment = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/9/comments/1000000')
          .send(updateComment)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      it('PATCH ERR response status:405 and a method not allowed message for non-existent comment_id param', () => {
        const updateComment = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/9/comments')
          .send(updateComment)
          .expect(405)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('method not allowed');
          });
      });

      it('PATCH ERR response status:400 and a bad request message for article_id which is not a number', () => {
        const updateComment = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/smiths_disco/comments/1')
          .send(updateComment)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      // DOUBLE PROMISE - IS PARAM IN ARTICLES.ARTICLE_ID
      it('PATCH ERR response status:400 and a bad request message for article_id which does not exist', () => {
        const updateComment = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/1000000/comments/1')
          .send(updateComment)
          .expect(400)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('bad request');
          });
      });

      // WILL NOT PASS TO ROUTER - HOW TO ERROR
      it('PATCH ERR response status:404 and a not found message for non-existent article_id param', () => {
        const updateComment = {
          inc_votes: 10,
        };
        return request
          .patch('/api/articles/comments/1')
          .send(updateComment)
          .expect(404)
          .then(({
            body,
          }) => {
            expect(body.msg).to.equal('not found');
          });
      });
    });

    describe('deleteArticleCommentByCommentId()', () => {
      it('DELETE response status:204 and no content', () => request.delete('/api/articles/9/comments/1').expect(204));

      it('DELETE ERR response status:400 and a bad request message for article_id which is not a number', () => request
        .delete('/api/articles/shake_a_maraca/comments/1')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      it('DELETE ERR response status:400 and a bad request message for comment_id which is not a number', () => request
        .delete('/api/articles/9/comments/shake_a_maraca')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      // DOUBLE PROMISE - IS PARAM IN ARTICLES.ARTICLE_ID
      it('DELETE ERR response status:400 and a bad request message for article_id which does not exist', () => request
        .delete('/api/articles/1000000/comments/1')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      // DOUBLE PROMISE - IS PARAM IN COMMENTS.COMMENT_ID
      it('DELETE ERR response status:400 and a bad request message for comment_id which does not exist', () => request
        .delete('/api/articles/9/comments/1000000')
        .expect(400)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('bad request');
        }));

      // WILL NOT PASS TO ROUTER - HOW TO ERROR
      it('DELETE ERR response status:404 and a not found message for non-existent article_id param', () => request
        .delete('/api/articles/comments/1')
        .expect(404)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('not found');
        }));

      it('DELETE ERR response status:405 and a method not allowed message for non-existent comment_id param', () => request
        .delete('/api/articles/9/comments')
        .expect(405)
        .then(({
          body,
        }) => {
          expect(body.msg).to.equal('method not allowed');
        }));
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
    });
  });
});
