# NC Knews Back-End Feedback

## General

- Great to see utils testing :)
- on your API page I would expand on the different methods for each endpoint and what is expected/will be returned
  <!-- * rather than `displayArticles` as the key-name, it would be more sensible to name this key `articles`, same applies to other endpoints -->
  <!-- * feels like a lot of line-breaks, but that's just me! -->
  <!-- * when responding with 204 (no content) there is no need to send anything inside the `.json()` as it will not be sent -->
- for `total_count`s, we want the total number that exist in the database that match the query (excluding the limit) not just the number returned for that limit query
  <!-- * where our model returns a SINGLE item, we must destructure this from the array that it is returned in (you have in places, but not consistently) -->
  <!-- * endpoints should return the article/comment writer's `username` AS `author` -->
- a bit more error handling needed, see test descriptions below :)

## Seeding

<!-- * `.notNullable()` in your migration files will be useful for trying to post empty articles/comments -->

## Errors

<!-- * Handle 500s function for if not caught by 400 or 404 functions? -->

## Routes

<!-- * use `.route()` where an endpoint can respond to multiple methods -->

## Our tests that you are not passing (full details further down):

/
/api
/topics

<!-- 1) POST status:201 responds with the added topic **array desctrucuring in the controller** -->

2. POST status:422 client sends a body with a duplicate slug **need to add error handling (and test) for this**
3. POST status:400 if request body is malformed (missing description property) **not null in sql tables (`.notNullabe()`)**
   <!-- 4) status:405 invalid HTTP method for this resource **we can add a `.all()` to our `.route()` chain after our allowed methods and invoke this with a 405 error handler** -->
   /topics/:topic/articles
   <!-- 5) POST status:201 and a newly added article for that topic **array desctrucuring in the controller**
           GET status:200 -->
   <!-- 6) responds with an array of article objects **`{displayArticles}` ---> `{articles: displayArticles}`** --> 7) responds with a total_count property giving the number of articles for that topic **total_count of all articles, not the limit that are responded with**
   <!-- 8) every article object has the given topic from the url **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 9) responds with an array of 10 article object (DEFAULT limit=10) **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 10) takes a limit query which alters the number of articles returned **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 11) can use a sort_by query (DEFAULT order_by: created_at) order (DEFAULT sort_order: DESC) **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 12) takes sort_by query which changes the column to sort by (DEFAULT order=DESC) **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 13) takes a order query which changes the sort to ascending (DEFAULT sort_by: created_at) **`{displayArticles}` ---> `{articles: displayArticles}`** --> 14) takes an p query which changes the start page DEFAULT (limit=10) **additional query to test and implement, will make your Front-end app much more feature rich** 15) takes a p query and a limit query **additional query to test and implement, will make your Front-end app much more feature rich**
   <!-- 16) returns default response if given invalid sort_by (DEFAULT order_by: created_at) order (DEFAULT sort_order: DESC) **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 17) all article objects have a comment_count property **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   ERRORS
   <!-- 18) POST status:404 adding an article to a non-existent topic **need to add some more error handling**
             19) invalid methods respond with 405  **mentioned above**
             20) POST status:400 if body is malformed (not null) (missing username and body) **not null, as mentioned above** -->
   /articles
   <!-- 21) status:405 invalid request method for end-point  **mentioned above** -->
   GET status:200
   <!-- 22) responds with an array of articles with correct keys **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 23) responds with an array of 10 articles (DEFAULT limit=10) **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 24) takes a limit query which alters the number of articles returned **`{displayArticles}` ---> `{articles: displayArticles}`** --> 25) takes an p query which alters the starting index of the articles returned (DEFAULT limit=10) **mentioned above**
   <!-- 26) sorts articles (DEFAULT sort_by=created_at) (DEFAULT order=desc) **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 27) takes sort_by query which alters the column by which data is sorted (DEFAULT order=desc) **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 28) takes a order query which changes the sort to ascending (DEFAULT sort_by=created_at) **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   <!-- 29) can take a sort_by and an order query **`{displayArticles}` ---> `{articles: displayArticles}`** --> 30) will ignore an invalid sort_by query **how could we ensure this? when do we know the query is valid/invalid**
   <!-- 31) article objects have a comment_count property **`{displayArticles}` ---> `{articles: displayArticles}`** -->
   /articles/:article_id
   <!-- 32) GET status:200 responds with a single article object **array destructuring** -->
   <!-- 33) PATCH status:200 and an updated article when given a body including a valid "inc_votes" (VOTE UP) **array destructuring** -->
   <!-- 34) PATCH status:200 responds with an updated article when given a body including a valid "inc_votes" (VOTE DOWN) **array destructuring** --> 35) PATCH status:400 if given an invalid inc_votes **error handling**
   <!-- 36) PATCH status:200s no body responds with an unmodified article **array destructuring** --> 37) DELETE status:404 when given a non-existent article_id **error handling**
   <!-- 38) invalid methods respond with 405 **as above** -->
   /api/articles/:article_id/comments
   GET
   status:200 39) can change the sort order (DEFAULT sort_by=created_at) **`fetchCommentsByArticleId`'s `sort_ascending` should be `order`**
   /articles/:article_id/comments/:comment_id
   <!-- 40) PATCH status:200 and an updated comment when given a body including a valid "inc_votes" (VOTE DOWN) **array destructuring** -->
   <!-- 41) PATCH status:200 with no body responds with an unmodified comment **array destructuring** --> 42) PATCH status:400 if given an invalid inc_votes **error handling** 43) PATCH status:404 non-existent article_id is used **error handling** 44) PATCH status:404 non-existent comment_id is used **error handling** 45) DELETE status:404 client uses a non-existent article_id **error handling** 46) DELETE status:404 client uses non-existent comment_id **error handling**
   <!-- 47) invalid methods respond with 405 **as above** -->
   /users
   <!-- 48) invalid methods respond with 405 **as above** -->
   /users/:username
   <!-- 49) invalid methods respond with 405 **as above** -->

16 passing (11s)
49 failing

1. /
   /api
   /topics
   POST status:201 responds with the added topic:
   AssertionError: expected undefined to equal 'test'
   at request.post.send.expect.then (spec/nc.spec.js:43:40)
   at process.\_tickCallback (internal/process/next_tick.js:68:7)

2. /
   /api
   /topics
   POST status:422 client sends a body with a duplicate slug:
   Error: expected 422 "Unprocessable Entity", got 500 "Internal Server Error"
   at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
   at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
   at Test.assert (node_modules/supertest/lib/test.js:173:18)
   at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
   at emitCloseNT (net.js:1618:8)
   at process.\_tickCallback (internal/process/next_tick.js:63:19)

3. /
   /api
   /topics
   POST status:400 if request body is malformed (missing description property):
   Error: expected 400 "Bad Request", got 201 "Created"
   at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
   at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
   at Test.assert (node_modules/supertest/lib/test.js:173:18)
   at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
   at emitCloseNT (net.js:1618:8)
   at process.\_tickCallback (internal/process/next_tick.js:63:19)

4. /
   /api
   /topics
   status:405 invalid HTTP method for this resource:
   Error: expected 405 "Method Not Allowed", got 404 "Not Found"
   at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
   at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
   at Test.assert (node_modules/supertest/lib/test.js:173:18)
   at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
   at emitCloseNT (net.js:1618:8)
   at process.\_tickCallback (internal/process/next_tick.js:63:19)

5. /
   /api
   /topics/:topic/articles
   POST status:201 and a newly added article for that topic:

   AssertionError: expected [ Array(1) ] to have keys 'username', 'title', 'article_id', 'votes', 'created_at', 'topic', and 'body'

   - expected - actual

   [

   - "0"

   * "article_id"
   * "body"
   * "created_at"
   * "title"
   * "topic"
   * "username"
   * "votes"
     ]

   at request.post.send.expect.then (spec/nc.spec.js:195:46)
   at process.\_tickCallback (internal/process/next_tick.js:68:7)

6. /
   /api
   /topics/:topic/articles
   GET status:200
   responds with an array of article objects:
   AssertionError: expected undefined to be an array
   at request.get.expect.then (spec/nc.spec.js:75:43)
   at process.\_tickCallback (internal/process/next_tick.js:68:7)

7. /
   /api
   /topics/:topic/articles
   GET status:200
   responds with a total_count property giving the number of articles for that topic:
   AssertionError: expected undefined to equal '11'
   at request.get.expect.then (spec/nc.spec.js:91:43)
   at process.\_tickCallback (internal/process/next_tick.js:68:7)

8. /
   /api
   /topics/:topic/articles
   GET status:200
   every article object has the given topic from the url:
   TypeError: Cannot read property 'every' of undefined
   at request.get.expect.then (spec/nc.spec.js:99:36)
   at process.\_tickCallback (internal/process/next_tick.js:68:7)

9. /
   /api
   /topics/:topic/articles
   GET status:200
   responds with an array of 10 article object (DEFAULT limit=10):
   TypeError: Cannot read property 'length' of undefined
   at request.get.expect.then (spec/nc.spec.js:107:36)
   at process.\_tickCallback (internal/process/next_tick.js:68:7)

10. /
    /api
    /topics/:topic/articles
    GET status:200
    takes a limit query which alters the number of articles returned:
    TypeError: Cannot read property 'length' of undefined
    at request.get.expect.then (spec/nc.spec.js:115:36)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

11. /
    /api
    /topics/:topic/articles
    GET status:200
    can use a sort_by query (DEFAULT order_by: created_at) order (DEFAULT sort_order: DESC):
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:123:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

12. /
    /api
    /topics/:topic/articles
    GET status:200
    takes sort_by query which changes the column to sort by (DEFAULT order=DESC):
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:132:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

13. /
    /api
    /topics/:topic/articles
    GET status:200
    takes a order query which changes the sort to ascending (DEFAULT sort_by: created_at):
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:141:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

14. /
    /api
    /topics/:topic/articles
    GET status:200
    takes an p query which changes the start page DEFAULT (limit=10):
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:149:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

15. /
    /api
    /topics/:topic/articles
    GET status:200
    takes a p query and a limit query:
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:157:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

16. /
    /api
    /topics/:topic/articles
    GET status:200
    returns default response if given invalid sort_by (DEFAULT order_by: created_at) order (DEFAULT sort_order: DESC):
    Error: expected 200 "OK", got 500 "Internal Server Error"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

17. /
    /api
    /topics/:topic/articles
    GET status:200
    all article objects have a comment_count property:
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:175:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

18. /
    /api
    /topics/:topic/articles
    ERRORS
    POST status:404 adding an article to a non-existent topic:
    Error: expected 404 "Not Found", got 500 "Internal Server Error"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

19. /
    /api
    /topics/:topic/articles
    ERRORS
    invalid methods respond with 405:
    Error: expected 405 "Method Not Allowed", got 404 "Not Found"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at localAssert (node_modules/supertest/lib/test.js:131:12)
    at /Users/paulrogerson/northcoders/reviews/BE2-reviews/craig/node_modules/supertest/lib/test.js:128:5
    at Test.Request.callback (node_modules/superagent/lib/node/index.js:728:3)
    at IncomingMessage.parser (node_modules/superagent/lib/node/index.js:916:18)
    at endReadableNT (\_stream_readable.js:1094:12)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

20. /
    /api
    /topics/:topic/articles
    ERRORS
    POST status:400 if body is malformed (not null) (missing username and body):
    Error: expected 400 "Bad Request", got 201 "Created"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

21. /
    /api
    /articles
    status:405 invalid request method for end-point:
    Error: expected 405 "Method Not Allowed", got 404 "Not Found"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

22. /
    /api
    /articles
    GET status:200
    responds with an array of articles with correct keys:
    AssertionError: expected undefined to be an array
    at request.get.expect.then (spec/nc.spec.js:244:43)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

23. /
    /api
    /articles
    GET status:200
    responds with an array of 10 articles (DEFAULT limit=10):
    AssertionError: Target cannot be null or undefined.
    at request.get.expect.then (spec/nc.spec.js:260:45)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

24. /
    /api
    /articles
    GET status:200
    takes a limit query which alters the number of articles returned:
    TypeError: Cannot read property 'length' of undefined
    at request.get.expect.then (spec/nc.spec.js:268:36)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

25. /
    /api
    /articles
    GET status:200
    takes an p query which alters the starting index of the articles returned (DEFAULT limit=10):
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:277:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

26. /
    /api
    /articles
    GET status:200
    sorts articles (DEFAULT sort_by=created_at) (DEFAULT order=desc):
    AssertionError: expected undefined to be an array
    at request.get.expect.then (spec/nc.spec.js:286:43)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

27. /
    /api
    /articles
    GET status:200
    takes sort_by query which alters the column by which data is sorted (DEFAULT order=desc):
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:298:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

28. /
    /api
    /articles
    GET status:200
    takes a order query which changes the sort to ascending (DEFAULT sort_by=created_at):
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:306:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

29. /
    /api
    /articles
    GET status:200
    can take a sort_by and an order query:
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:313:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

30. /
    /api
    /articles
    GET status:200
    will ignore an invalid sort_by query:
    Error: expected 200 "OK", got 500 "Internal Server Error"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

31. /
    /api
    /articles
    GET status:200
    article objects have a comment_count property:
    TypeError: Cannot read property '0' of undefined
    at request.get.expect.then (spec/nc.spec.js:331:35)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

32. /
    /api
    /articles/:article_id
    GET status:200 responds with a single article object:

    AssertionError: expected { Object (article_id, username, ...) } to have keys 'article_id', 'body', 'author', 'created_at', 'votes', 'topic', 'comment_count', and 'title'

    - expected - actual

    [
    "article_id"

    - "author"
      "body"
      "comment_count"
      "created_at"
      "title"
      "topic"

    * "username"
      "votes"
      ]

    at request.get.expect.then (spec/nc.spec.js:354:46)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

33. /
    /api
    /articles/:article_id
    PATCH status:200 and an updated article when given a body including a valid "inc_votes" (VOTE UP):
    AssertionError: expected undefined to equal 101
    at request.patch.send.expect.then (spec/nc.spec.js:380:43)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

34. /
    /api
    /articles/:article_id
    PATCH status:200 responds with an updated article when given a body including a valid "inc_votes" (VOTE DOWN):
    AssertionError: expected undefined to equal 99
    at request.patch.send.expect.then (spec/nc.spec.js:389:43)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

35. /
    /api
    /articles/:article_id
    PATCH status:400 if given an invalid inc_votes:
    Error: expected 400 "Bad Request", got 500 "Internal Server Error"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

36. /
    /api
    /articles/:article_id
    PATCH status:200s no body responds with an unmodified article:
    AssertionError: expected undefined to equal 100
    at request.patch.expect.then (spec/nc.spec.js:403:43)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

37. /
    /api
    /articles/:article_id
    DELETE status:404 when given a non-existent article_id:
    Error: expected 404 "Not Found", got 204 "No Content"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

38. /
    /api
    /articles/:article_id
    invalid methods respond with 405:
    Error: expected 405 "Method Not Allowed", got 404 "Not Found"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

39. /
    /api
    /api/articles/:article_id/comments
    GET
    status:200
    can change the sort order (DEFAULT sort_by=created_at):

    AssertionError: expected 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.' to equal 'This morning, I showered for nine minutes.'

    - expected - actual

    -The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.
    +This morning, I showered for nine minutes.

    at request.get.expect.then (spec/nc.spec.js:502:50)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

40. /
    /api
    /articles/:article_id/comments/:comment_id
    PATCH status:200 and an updated comment when given a body including a valid "inc_votes" (VOTE DOWN):
    AssertionError: expected undefined to equal 13
    at request.patch.send.expect.then (spec/nc.spec.js:581:43)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

41. /
    /api
    /articles/:article_id/comments/:comment_id
    PATCH status:200 with no body responds with an unmodified comment:
    AssertionError: expected undefined to equal 14
    at request.patch.expect.then (spec/nc.spec.js:590:43)
    at process.\_tickCallback (internal/process/next_tick.js:68:7)

42. /
    /api
    /articles/:article_id/comments/:comment_id
    PATCH status:400 if given an invalid inc_votes:
    Error: expected 400 "Bad Request", got 500 "Internal Server Error"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

43. /
    /api
    /articles/:article_id/comments/:comment_id
    PATCH status:404 non-existent article_id is used:
    Error: expected 404 "Not Found", got 200 "OK"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

44. /
    /api
    /articles/:article_id/comments/:comment_id
    PATCH status:404 non-existent comment_id is used:
    Error: expected 404 "Not Found", got 200 "OK"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

45. /
    /api
    /articles/:article_id/comments/:comment_id
    DELETE status:404 client uses a non-existent article_id:
    Error: expected 404 "Not Found", got 204 "No Content"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

46. /
    /api
    /articles/:article_id/comments/:comment_id
    DELETE status:404 client uses non-existent comment_id:
    Error: expected 404 "Not Found", got 204 "No Content"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

47. /
    /api
    /articles/:article_id/comments/:comment_id
    invalid methods respond with 405:
    Error: expected 405 "Method Not Allowed", got 404 "Not Found"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at Server.localAssert (node_modules/supertest/lib/test.js:131:12)
    at emitCloseNT (net.js:1618:8)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

48. /
    /users
    invalid methods respond with 405:
    Error: expected 405 "Method Not Allowed", got 404 "Not Found"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at localAssert (node_modules/supertest/lib/test.js:131:12)
    at /Users/paulrogerson/northcoders/reviews/BE2-reviews/craig/node_modules/supertest/lib/test.js:128:5
    at Test.Request.callback (node_modules/superagent/lib/node/index.js:728:3)
    at IncomingMessage.parser (node_modules/superagent/lib/node/index.js:916:18)
    at endReadableNT (\_stream_readable.js:1094:12)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)

49. /
    /users/:username
    invalid methods respond with 405:
    Error: expected 405 "Method Not Allowed", got 404 "Not Found"
    at Test.\_assertStatus (node_modules/supertest/lib/test.js:268:12)
    at Test.\_assertFunction (node_modules/supertest/lib/test.js:283:11)
    at Test.assert (node_modules/supertest/lib/test.js:173:18)
    at localAssert (node_modules/supertest/lib/test.js:131:12)
    at /Users/paulrogerson/northcoders/reviews/BE2-reviews/craig/node_modules/supertest/lib/test.js:128:5
    at Test.Request.callback (node_modules/superagent/lib/node/index.js:728:3)
    at IncomingMessage.parser (node_modules/superagent/lib/node/index.js:916:18)
    at endReadableNT (\_stream_readable.js:1094:12)
    at process.\_tickCallback (internal/process/next_tick.js:63:19)
