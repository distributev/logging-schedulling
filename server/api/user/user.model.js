'use strict';

import crypto from 'crypto';
var authTypes = ['github', 'twitter', 'facebook', 'google'];
import Promise from 'bluebird';
import Joi from 'joi';

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(bookshelf) {
  var User = bookshelf.Model.extend({
    tableName: 'User',
    constructor: function() {
      bookshelf.Model.apply(this, arguments);

      /**
       * Pre-save hooks
       */
      this.on('creating', function(model) {
        return new Promise(function(resolve, reject) {
          model.updatePassword(function(err, hashPassword) {
            if (err) reject(err);
            model.set('password', hashPassword);
            resolve(hashPassword); // data is created only after this occurs
          });
        });
      });

      /**
       * Pre-update hooks
       */
      this.on('updating', function(model) {
        return new Promise(function(resolve, reject) {
          if (model.hasChanged('password')) {
            model.updatePassword(function(err, hashPassword) {
              if (err) reject(err);
              model.set('password', hashPassword);
              resolve(hashPassword); // data is updated only after this occurs
            });
          } else {
            resolve(model.get('password'));
          }
        });
      });
    },

	  /**
     * ID Field Attribute
     */
    idAttribute: '_id',

	  /**
     * Validation
     */
    validate: {
      name: Joi.string(),
      email: Joi.string().email().required(),
      role: Joi.string(),
      theme: Joi.string(),
      password: Joi.string().required(),
      provider: Joi.string()
    },

    /**
     * Virtual Getters
     */
    virtuals: {
      // Public profile information
      profile: function() {
        return {
          'name': this.get('name'),
          'role': this.get('role')
        };
      },

      // Non-sensitive info we'll be putting in the token
      token: function() {
        return {
          '_id': this.get('_id'),
          'role': this.get('role')
        };
      }
    },

    /**
     * Instance Methods
     */

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    authenticate: function(password, callback) {
      if (!callback) {
        return this.get('password') === this.encryptPassword(password);
      }

      var _this = this;
      this.encryptPassword(password, function(err, pwdGen) {
        if (err) {
          callback(err);
        }

        if (_this.get('password') === pwdGen) {
          callback(null, true);
        }
        else {
          callback(null, false);
        }
      });
    },

    /**
     * Make salt
     *
     * @param {Number} byteSize Optional salt byte size, default to 16
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt: function(byteSize, callback) {
      var defaultByteSize = 16;

      if (typeof arguments[0] === 'function') {
        callback = arguments[0];
        byteSize = defaultByteSize;
      }
      else if (typeof arguments[1] === 'function') {
        callback = arguments[1];
      }

      if (!byteSize) {
        byteSize = defaultByteSize;
      }

      if (!callback) {
        return crypto.randomBytes(byteSize).toString('base64');
      }

      return crypto.randomBytes(byteSize, function(err, salt) {
        if (err) {
          callback(err);
        }
        return callback(null, salt.toString('base64'));
      });
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword: function(password, callback) {
      if (!password || !this.get('salt')) {
        if (!callback) {
          return null;
        }
        return callback(null);
      }

      var defaultIterations = 10000;
      var defaultKeyLength = 64;
      var salt = new Buffer(this.get('salt'), 'base64');

      if (!callback) {
        return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
          .toString('base64');
      }

      return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
        function(err, key) {
          if (err) {
            callback(err);
          }
          return callback(null, key.toString('base64'));
        });
    },

    /**
     * Update password field
     *
     * @param {Function} fn
     * @return {String}
     * @api public
     */
    updatePassword: function(fn) {
      // Handle new/update passwords
      if (this.get('password')) {
        if (!validatePresenceOf(this.get('password')) && authTypes.indexOf(this.get('provider')) === -1) {
          fn(new Error('Invalid password'));
        }

        // Make salt with a callback
        var _this = this;
        this.makeSalt(function(saltErr, salt) {
          if (saltErr) {
            fn(saltErr);
          }
          _this.set('salt', salt);
          _this.encryptPassword(_this.get('password'), function(encryptErr, hashPassword) {
            if (encryptErr) {
              fn(encryptErr);
            }
            _this.set('password', hashPassword);
            fn(null, hashPassword);
          });
        });
      } else {
        fn(null);
      }
    }

  });

  return User;
};
