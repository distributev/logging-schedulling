(function() {
  'use strict';

  angular
    .module('flowScripts')
    .directive('viewScriptDetails', viewScriptDetails);

  viewScriptDetails.$inject = [];

  function viewScriptDetails() {
    return {
      templateUrl: 'components/scripts/script/views/view-script-details.view.html',
      restrict: 'E',
      scope: {
        scriptId: '=', // the ID of the Script to view details of
        autoRefreshInterval: '@', // auto-refresh the Script details autoRefreshInterval ms - default value is 60 000 ms (1 minute)
        showRequeueButton: '=', // if TRUE then show the Requeue button otherwise don't show default value is TRUE
        onclose: '&'
      },
      controller: 'ViewScriptDetailsController',
      controllerAs: 'viewScriptDetailsCtrl'
    };
  }
})();