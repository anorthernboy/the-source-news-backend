exports.up = function (connection, Promise) {
  return connection.schema.createTable('users', (usersTable) => {
    usersTable.string('username').primary().notNullable();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
    usersTable.unique('username');
  });
};

exports.down = function (connection, Promise) {
  return connection.schema.dropTable('users');
};
