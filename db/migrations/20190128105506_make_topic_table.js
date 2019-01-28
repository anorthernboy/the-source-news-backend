exports.up = function (connection, Promise) {
  return connection.schema.createTable('topics', function (topicsTable) {
    topicsTable.string('slug').primary();
    topicsTable.string('description');
    topicsTable.unique('slug');
  })
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('topics')
};