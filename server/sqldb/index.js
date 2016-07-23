/**
 * Bookshelf initialization module
 */

'use strict';

import config from '../config/environment';
import knex from 'knex';
import bookshelf from 'bookshelf';
import bookshelfModelbase from 'bookshelf-modelbase';
import userModel from '../api/user/user.model';
import Promise from 'bluebird';

var knexInstance = knex(config.bookshelf);

var db = {
  bookshelf: bookshelf(knexInstance) // Initialize bookshelf by passing the knex instance
};

// Enable bookshelf plugins
db.bookshelf.plugin('virtuals');
db.bookshelf.plugin(bookshelfModelbase.pluggable);

// Insert models below
db.User = userModel(db.bookshelf);

// Add additional sync method to initialize the table
db.User.sync = function() {
  if (!db.User.promise) {
    db.User.promise = new Promise(function(resolve) {
      knexInstance.schema.hasTable('User').then(function(exists) {
        if (!exists) {
          return knexInstance.schema.createTable('User', function(table) {
            table.increments('_id').primary();
            table.string('name');
            table.string('email').unique();
            table.string('role').defaultTo('user');
            table.string('password');
            table.string('theme');
            table.string('provider');
            table.string('salt');
            table.json('google');
            table.json('github');
            table.timestamps();

            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  return db.User.promise;
};

db.bookshelf.sync = function() {
  return db.User.sync();
};

module.exports = db;
