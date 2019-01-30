process.env.NODE_ENV = "test";

const {
  expect
} = require("chai");

const app = require("../app");

const request = require("supertest")(app);

const connection = require("../db/connection");


describe("/api", () => {

  // before each mocha hook ensure database is stripped down and built up
  beforeEach(() => {
    return connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run());
  });

  // after each mocha hook ensure connection is not left hanging
  after(() => connection.destroy());

  //                  //
  //                  //
  //  TOPICS ROUTER   //
  //                  //
  //                  //

  describe("/topics", () => {

    describe('getTopics()', () => {

      it("GET response status:200 and an array of topic objects", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contains.keys("description", "slug");
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

    })

    describe('addTopic()', () => {

      it("POST response status:201 and the new topic object", () => {
        const newTopic = {
          slug: "joystick",
          description: "wreck pastel slip snail meadow upset consumption",
        };
        return request
          .post("/api/topics")
          .send(newTopic)
          .expect(201)
          .then(({
            body
          }) => {
            expect(body.topic).to.be.an("array");
            expect(body.topic[0].slug).to.equal("joystick");
            expect(body.topic[0]).to.contains.keys("description", "slug");
          });
      });

    })

    describe('getArticlesByTopic()', () => {

      it("GET response status:200 and an array of article objects for the topic", () => {
        return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles[0].topic).to.equal("mitch");
            expect(body.articles[0]).to.contains.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "username",
              "created_at"
            );
          });
      });

    })

    describe('addArticleByTopic()', () => {

      it("POST response status:201 and the new article object", () => {
        const newArticle = {
          title: "FA investigates allegations of homophobic chanting at Sol Campbell",
          body: "The Football Association has launched an investigation into claims Sol Campbell was subjected to homophobic abuse during Macclesfield’s visit to Cheltenham on Saturday. It comes after several Cheltenham fans wrote about chants directed towards the away manager on social media after the match, which the home side won 3 - 2. One supporter tweeted that 'the homophobic chants and references towards Sol Campbell were disgusting. Disappointed the stewards didn’t seem to do anything.' Another said: 'It was horrendous. And not for the first time this season. Cheltenham need to nip it before it happens again.'",
          username: "butter_bridge",
        };
        return request
          .post("/api/topics/mitch/articles")
          .send(newArticle)
          .expect(201)
          .then(({
            body
          }) => {
            expect(body.article).to.be.an("array");
            expect(body.article[0].topic).to.equal("mitch");
            expect(body.article[0]).to.contains.keys("article_id",
              "title",
              "body",
              "votes",
              "topic",
              "username",
              "created_at");
          });
      });

    })

  });

  //                  //
  //                  //
  //   USERS ROUTER   //
  //                  //
  //                  //

  describe("/users", () => {

    describe('fetchUsers()', () => {

      it("GET response status:200 and an array of user objects", () => {
        return request
          .get("/api/users")
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.users).to.be.an("array");
            expect(body.users[0]).to.contains.keys(
              "username",
              "name",
              "avatar_url"
            );
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

    })

    describe('addNewUser()', () => {
      it("POST response status:201 and the new user object", () => {
        const newUser = {
          username: "stilton_01",
          avatar_url: "https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjg34fngpTgAhXvzoUKHRazDl4QjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FStilton_cheese&psig=AOvVaw15ktD8EaV9Tuerl1iw3MoP&ust=1548886717641327",
          name: "leon",
        };
        return request
          .post("/api/users")
          .send(newUser)
          .expect(201)
          .then(({
            body
          }) => {
            expect(body.user).to.be.an("array");
            expect(body.user[0].username).to.equal("stilton_01");
            expect(body.user[0]).to.contains.keys("username",
              "name",
              "avatar_url");
          });
      });
    })

    describe('fetchUserByUsername()', () => {

      it("GET response status:200 and a user object for the username", () => {
        return request
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.user).to.be.an("array");
            expect(body.user[0].username).to.equal("butter_bridge");
            expect(body.user[0]).to.contains.keys(
              "username",
              "name",
              "avatar_url"
            );
          });
      });
    })

    describe('fetchArticlesByUsername()', () => {

      it("GET response status:200 and an array of articles for the username", () => {
        return request
          .get("/api/users/butter_bridge/articles")
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles[0].username).to.equal("butter_bridge");
            expect(body.articles[0]).to.contains.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "username",
              "created_at"
            );
          });
      });
    })

  });

  //                  //
  //                  //
  // ARTICLES ROUTER  //
  //                  //
  //                  //

  describe("/articles", () => {
    it("GET response status:200 and an array of article objects", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0]).to.contains.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "username",
            "created_at"
          );
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

    it("GET response status:200 and an array of article objects for the article_id", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.article).to.be.an("array");
          expect(body.article[0].article_id).to.equal(1);
          expect(body.article[0]).to.contains.keys(
            "article_id",
            "title",
            "body",
            "votes",
            "topic",
            "username",
            "created_at"
          );
        });
    });

    it("GET response status:200 and an array of comment objects for the article_id", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0].article_id).to.equal(1);
          expect(body.comments[0]).to.contains.keys(
            "comment_id",
            "username",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
        });
    });

    it("POST response status:201 and the new comment object", () => {
      const newComment = {
        body: "Thanks very much Newcastle United for making an awful Brexit day a wee bit better.",
        username: "butter_bridge",
      };
      return request
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({
          body
        }) => {
          expect(body.comment).to.be.an("array");
          expect(body.comment[0].article_id).to.equal(2);
          expect(body.comment[0]).to.contains.keys("comment_id",
            "username",
            "article_id",
            "votes",
            "created_at",
            "body");
        });
    });

  });

  //                  //
  //                  //
  // COMMENTS ROUTER  //
  //                  //
  //                  //

  describe("/comments", () => {
    it("GET response status:200 and an array of comment objects", () => {
      return request
        .get("/api/comments")
        .expect(200)
        .then(({
          body
        }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.contains.keys(
            "comment_id",
            "username",
            "article_id",
            "votes",
            "created_at",
            "body"
          );
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
});