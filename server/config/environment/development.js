'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Seed database on startup
  seedDB: true,

  // Bookshelf connection options
  bookshelf: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite'
    },
    useNullAsDefault: true
  },

  // Redis config Options
  redis: {
    configPath: './theapp-template/TheApp/config/databases/redis.json',
    exePath: './theapp-template/TheApp/_internal/tools/redis2.8.2400-xp32bit'
  }
};
