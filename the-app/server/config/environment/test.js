'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/angularfullstack-test'
  },

  // Bookshelf connection options
  bookshelf: {
    client: 'sqlite3',
    connection: {
      filename: './test.sqlite'
    },
    useNullAsDefault: true
  },

  // Redis config Options
  redis: {
    configPath: './theapp-template/TheApp/config/databases/redis.json',
    exePath: './theapp-template/TheApp/_internal/tools/redis2.8.2400-xp32bit'
  }
};
