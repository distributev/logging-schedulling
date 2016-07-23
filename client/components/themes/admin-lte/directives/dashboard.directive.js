(function() {
  'use strict';

  angular
    .module('admin-lte')
    .directive('dashboard', dashboard);

  dashboard.$inject = [];

  function dashboard() {
    return {
      templateUrl: 'components/themes/admin-lte/views/dashboard.view.html',
      restrict: 'E'
    };
  }
})();
