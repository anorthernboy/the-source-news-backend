exports.up = function (connection, Promise) {
  return connection.schema.createTable('users', function (usersTable) {
    usersTable.string('username').primary();
    usersTable.string('avatar_url');
    usersTable.string('name');
    usersTable.unique('username');
  })
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('users')
};