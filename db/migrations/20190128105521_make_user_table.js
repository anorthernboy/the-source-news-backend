exports.up = function (knex, Promise) {
  return connection.schema.createTable('users', function (usersTable) {
    usersTable.string('username').primary();
    usersTable.string('avatar_url');
    usersTable.string('name');
    usersTable.unique('username');
  })
};

exports.down = function (knex, Promise) {
  return connection.schema.dropTable('users')
};