(function() {
  'use strict';

  angular
    .module('Script')
    .directive('scripts', Script);

  Script.$inject = [];

  function Script() {
    return {
      templateUrl: 'components/scripts/views/scripts.view.html',
      restrict: 'E',
      scope: {
        scriptType: '@'
      },
      controller: 'ScriptController',
      controllerAs: 'ScriptCtrl'
    };
  }
})();
