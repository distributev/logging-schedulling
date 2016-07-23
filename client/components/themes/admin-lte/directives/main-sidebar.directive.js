(function() {
  'use strict';

  angular
    .module('admin-lte')
    .directive('mainSidebar', mainSidebar);

    mainSidebar.$inject = [];

    function mainSidebar() {
      return {
        templateUrl: 'components/themes/admin-lte/views/main-sidebar.view.html',
        restrict: 'E',
        replace: true,
        controller: 'MainSidebarController',
        controllerAs: 'mainSidebar'
      };
    }
})();

