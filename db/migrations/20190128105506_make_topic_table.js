exports.up = function (connection, Promise) {
  return connection.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug').primary();
    topicsTable.string('description');
    topicsTable.unique('slug');
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('topics');
};
