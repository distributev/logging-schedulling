(function() {
  'use strict';

  angular
    .module('Script')
    .directive('listScripts', listscripts);

  listscripts.$inject = [];

  function listscripts() {
    return {
      templateUrl: 'components/scripts/kue/views/list-scripts.view.html',
      restrict: 'E',
      scope: {
        scriptType: '@', // if provided the rendered table will list only the scripts of type scriptType; otherwise render all scripts no matter of their type
        perPage: '@', // number of rows to display on a single page when using pagination. - default value is 10
        autoRefreshInterval: '@',
        ontoggle: '&'
      },
      controller: 'ListscriptsController',
      controllerAs: 'listscriptsCtrl'
    };
  }
})();
