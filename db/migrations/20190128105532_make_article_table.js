exports.up = function (connection, Promise) {
  return connection.schema.createTable('articles', function (articlesTable) {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title')
    articlesTable.string('body')
    articlesTable.integer('votes').defaultTo(0)
    articlesTable.string('topic').references('topics.slug')
    articlesTable.string('username').references('users.username')
    articlesTable.timestamp('created_at')
  })
}

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('articles')
};