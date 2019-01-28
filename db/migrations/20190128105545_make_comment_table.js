exports.up = function (knex, Promise) {
    return connection.schema.createTable('comments', function (commentsTable) {
        commentsTable.increments('comment_id').primary();
        commentsTable.references('users.username')
        commentsTable.references('articles.article_id')
        commentsTable.integer('votes').defaultTo(0)
        commentsTable.timestamp('created_at')
        commentsTable.string('body')
      }
    };

    exports.down = function (knex, Promise) {
      return connection.schema.dropTable('comments')
    };