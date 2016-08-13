'use strict';

// Production specific configuration
// =================================

var path = require('path');
var dbConfig = require(path.join(__dirname, '/../../../../theapp-template/TheApp/config/databases/datasources.json')).mailmerge;
// Bookshelf connection options
var bookshelf = {};

// Defaults to sqlite3
if (dbConfig.storage) {
  bookshelf = {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '/../../../../theapp-template/TheApp/',  dbConfig.storage)
    },
    useNullAsDefault: true
  };
}
// mysql connection options
else {
  bookshelf = {
    client: dbConfig.dialect,
    connection: {
      host: dbConfig.host,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      charset  : 'utf8'
    },
    useNullAsDefault: true
  };
}

module.exports = {
  // Server IP
  ip:     process.env.OPENSHIFT_NODEJS_IP ||
          process.env.IP ||
          undefined,

  // Server port
  port:   process.env.OPENSHIFT_NODEJS_PORT ||
          process.env.PORT ||
          8080,

  // Bookshelf connection options
  bookshelf: bookshelf,

  // Redis config Options
  redis: {
    configPath: '../theapp-template/TheApp/config/databases/redis.json',
    exePath: '../theapp-template/TheApp/_internal/tools/redis2.8.2400-xp32bit'
  }
};
