'use strict';

(function () {
  'use strict';

  angular.module('flowScripts').directive('scripts', Script);

  Script.$inject = [];

  function Script() {
    return {
      templateUrl: 'components/scripts/script/views/scripts.view.html',
      restrict: 'E',
      scope: {
        scriptType: '@'
      },
      controller: 'ScriptController',
      controllerAs: 'ScriptCtrl'
    };
  }
})();
//# sourceMappingURL=scripts.directive.js.map
