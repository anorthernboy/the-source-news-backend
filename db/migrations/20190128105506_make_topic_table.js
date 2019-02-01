exports.up = function (connection, Promise) {
  return connection.schema.createTable('topics', (topicsTable) => {
    topicsTable.string('slug').primary().notNullable();
    topicsTable.string('description').notNullable();
    topicsTable.unique('slug');
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('topics');
};
