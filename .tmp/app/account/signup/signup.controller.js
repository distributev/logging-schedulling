'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignupController = function () {
  //end-non-standard

  function SignupController(Auth, $state) {
    _classCallCheck(this, SignupController);

    this.Auth = Auth;
    this.$state = $state;
  }
  //start-non-standard


  _createClass(SignupController, [{
    key: 'register',
    value: function register(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        }).then(function () {
          // Account created, redirect to home
          _this.$state.go('main');
        }).catch(function (err) {
          err = err.data;
          _this.errors = {};

          // Update validity of form fields that match the bookshelf errors
          if (err.name) {
            angular.forEach(err.fields, function (field) {
              form[field].$setValidity('mongoose', false);
              _this.errors[field] = err.message;
            });
          }
        });
      }
    }
  }]);

  return SignupController;
}();

angular.module('angularFullstackApp').controller('SignupController', SignupController);
//# sourceMappingURL=signup.controller.js.map
