(function() {
  'use strict';

  angular
    .module('admin-lte')
    .directive('login', login);

  login.$inject = [];

  function login() {
    return {
      templateUrl: 'components/themes/admin-lte/views/login.view.html',
      restrict: 'E',
      controller: 'LoginController',
      controllerAs: 'login'
    };
  }
})();
