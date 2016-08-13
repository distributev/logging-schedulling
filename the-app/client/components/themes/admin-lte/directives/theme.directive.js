(function() {
  'use strict';

  angular
    .module('admin-lte')
    .directive('adminLte', adminLte);

  adminLte.$inject = [];

  function adminLte() {
    return {
      templateUrl: 'components/themes/admin-lte/views/theme.view.html',
      restrict: 'E',
      controller: 'ThemeController',
      controllerAs: 'themeCtrl'
    };
  }
})();
