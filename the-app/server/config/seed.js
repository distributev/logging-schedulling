/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
import kue from 'kue';
import request from 'request';
import config from './environment';
import path from 'path';

var User = sqldb.User;
var queue = kue.createQueue({
  disableSearch: true,
  redis: require(path.join(config.root, config.redis.configPath)).redis
});

User.sync()
  .then(() => {
    User.findAll().then(function (users) {
      users.models.forEach(function(user) {
        user.destroy();
      });

      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
      });

      User.create({
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      });
    });
  })
  .then(() => {
    console.log('finished populating users');
  });

queue.create('email', {
  title: 'Just a dummy email job',
  to: 'dummy@user.com',
  template: 'dummy-email',
}).priority('normal').save();

queue.create('email', {
  title: 'Just a dummy email job',
  to: 'dummy@user.com',
  template: 'dummy-email'
}).priority('high').save();

queue.create('email2', {
  title: 'Just a dummy email job',
  to: 'dummy@user.com',
  template: 'dummy-email',
}).priority('normal').save();

queue.create('email2', {
  title: 'Just a dummy email job',
  to: 'dummy@user.com',
  template: 'dummy-email'
}).priority('high').save();

queue.create('email2', {
  title: 'Just a dummy email delayed job',
  to: 'dummy@user.com',
  template: 'dummy-email'
}).delay(500000).priority('high').save();

queue.create('backup', {
  title: 'Just a dummy backup job',
  interval: 'daily'
}).priority('normal').save();

queue.create('backup', {
  title: 'Just a dummy backup job',
  interval: 'weekly'
}).priority('high').save();

queue.create('backup2', {
  title: 'Just a dummy backup job',
  interval: 'daily'
}).priority('normal').save();

queue.create('backup2', {
  title: 'Just a dummy backup job',
  interval: 'weekly'
}).priority('high').save();

queue.create('run report', {
  title: 'Just a dummy run report job',
  reportType: 'annual'
}).priority('normal').save();

queue.create('run report', {
  title: 'Just a dummy run report job',
  reportType: 'quarter'
}).priority('high').save();

queue.create('run report', {
  title: 'Just a dummy run report delayed job',
  reportType: 'daily'
}).delay(100000).priority('low').save();

queue.create('run report2', {
  title: 'Just a dummy run report job',
  reportType: 'annual'
}).priority('normal').save();

queue.create('run report2', {
  title: 'Just a dummy run report job',
  reportType: 'quarter'
}).priority('high').save();

queue.process('email', function(job, done){
  done();
});

queue.process('backup', function(job, done){
  done('Ops something went wrong. Bummer!');
});

queue.process('run report', function(job, done){
});

queue.process('backup2', function(job, done){
  done();
});

queue.process('run report2', function(job, done){
  done('Ops something went wrong. Bummer!');
});

queue.process('email2', function(job, done){
});

