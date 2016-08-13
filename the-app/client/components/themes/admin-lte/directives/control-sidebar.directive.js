(function() {
  'use strict';

  angular
    .module('admin-lte')
    .directive('controlSidebar', controlSidebar);

  controlSidebar.$inject = [];

  function controlSidebar() {
    return {
      templateUrl: 'components/themes/admin-lte/views/control-sidebar.view.html',
      restrict: 'E',
      replace: true,
      controller: 'ControlSidebarController',
      controllerAs: 'controlSidebar'
    };
  }
})();

