(function() {
  'use strict';

  angular
    .module('admin-lte')
    .directive('signup', signup);

  signup.$inject = [];

  function signup() {
    return {
      templateUrl: 'components/themes/admin-lte/views/signup.view.html',
      restrict: 'E',
      controller: 'SignupController',
      controllerAs: 'signup'
    };
  }
})();
