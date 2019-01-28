exports.up = function (connection, Promise) {
  return connection.schema.createTable('comments', function (commentsTable) {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('created_by').references('users.username');
    commentsTable.integer('belongs_to').references('articles.article_id');
    commentsTable.integer('votes').defaultTo(0);
    commentsTable.timestamp('created_at').defaultTo(connection.fn.now());
    commentsTable.text('body');
  })
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('comments')
};