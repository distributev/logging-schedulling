(function() {
  'use strict';

  angular
    .module('admin-lte')
    .directive('mainFooter', mainFooter);

    mainFooter.$inject = [];

    function mainFooter() {
      return {
        templateUrl: 'components/themes/admin-lte/views/main-footer.view.html',
        restrict: 'E',
        replace: true
      };
    }
})();

