/**
 * Start Redis Server
 */

'use strict';

import path from 'path';
import os from 'os';
import fs from 'fs';
import config from './config/environment';

var spawn = require('child_process').spawn;

export default function(app) {
  var env = app.get('env');
  // Check if os is windows
  if (os.platform() === 'win32') {
    // Get the redis config
    var exePath = path.join(config.root, config.redis.exePath);
    var configPath = path.join(config.root, config.redis.configPath);
    // Check if redis config file exists
    fs.access(configPath, fs.F_OK, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        var redisConfig = require(configPath);
        // Check if the bundled redis should be started
        if (redisConfig.redis && redisConfig.redis.mode && redisConfig.redis.mode === 'bundled') {
          // Start the redis server
          var redis = spawn(path.join(exePath, 'redis-server'), [path.join(exePath, 'redis.windows.conf'), '--port', redisConfig.redis.port]);
          redis.on('exit', function (code) {
            console.log('Redis server terminated with exit code: ' + code);
          });
        }
      }
    });
  }
}
