'use strict';

(function () {
  'use strict';

  angular.module('flowScripts').directive('listScripts', listscripts);

  listscripts.$inject = [];

  function listscripts() {
    return {
      templateUrl: 'components/scripts/script/views/list-scripts.view.html',
      restrict: 'E',
      scope: {
        scriptType: '@', // if provided the rendered table will list only the scripts of type scriptType; otherwise render all scripts no matter of their type
        perPage: '@', // number of rows to display on a single page when using pagination. - default value is 10
        autoRefreshInterval: '@',
        ontoggle: '&'
      },
      controller: 'ListScriptsController',
      controllerAs: 'listScriptsCtrl'
    };
  }
})();
//# sourceMappingURL=list-scripts.directive.js.map
