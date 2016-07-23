(function() {
  'use strict';

  angular
    .module('admin-lte')
    .directive('mainNav', mainNav);

    mainNav.$inject = [];

    function mainNav() {
      return {
        templateUrl: 'components/themes/admin-lte/views/main-nav.view.html',
        restrict: 'E',
        replace: true,
        controller: 'MainNavController',
        controllerAs: 'mainNav'
      };
    }
})();

