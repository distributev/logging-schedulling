'use strict';

(function () {
  'use strict';

  angular.module('flowScripts').controller('ViewScriptDetailsController', ViewScriptDetailsController);

  ViewScriptDetailsController.$inject = ['$scope', '$interval', '$uibModal', 'ScriptsManager'];

  function ViewscriptDetailsController($scope, $interval, $uibModal, ScriptsManager) {
    var scope = $scope;
    var scriptIdWatcher = null;
    var refreshDataInterval = null;
    var vm = this;
    vm.message = 'Loading script...';
    vm.deletescript = deleteScript;
    vm.onclose = onclose;
    vm.requeuescript = requeueScript;

    activate();

    function activate() {
      if (!scope.autoRefreshInterval) {
        scope.autoRefreshInterval = 60000;
      }

      /**
       * script id watcher
       */
      scriptIdWatcher = scope.$watch('scriptId', function (newValue) {
        if (refreshDataInterval) {
          $interval.cancel(refreshDataInterval);
        }

        if (newValue) {
          ScriptsManager.getScript(newValue).then(function (script) {
            vm.script = script;
          }, function (err) {
            vm.message = err;
          });

          refreshDataInterval = $interval(function () {
            refreshScript();
          }, scope.autoRefreshInterval);
        } else {
          vm.message = 'Script ID is required';
        }
      });
    }

    /**
     * On destroy handling
     */
    scope.$on('$destroy', function () {
      if (scriptIdWatcher) {
        scriptIdWatcher();
      }

      if (refreshDataInterval) {
        $interval.cancel(refreshDataInterval);
      }
    });

    /**
     * Delete current script
     */
    function deletescript() {
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/confirmation-dialog/confirmation-dialog.view.html',
        controller: 'ConfirmationDialogController',
        controllerAs: 'confirmationDialogCtrl',
        resolve: {
          confirmationText: function confirmationText() {
            return 'This will permanently delete the script. Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function (accept) {
        if (accept) {
          ScriptsManager.deleteScript(scope.scriptId).then(function (message) {
            vm.script = null;
            vm.message = message;
          });
        }
      });
    }

    /**
      * On close click
      */
    function onclose() {
      if (angular.isFunction(scope.onclose)) {
        scope.onclose({
          scriptId: scope.scriptId
        });
      }
    }

    /**
     * Refresh current script
     */
    function refreshscript() {
      ScriptsManager.refreshScript(scope.scriptId).then(function (script) {
        vm.script = script;
      });
    }

    /**
      * Requeue script i.e. create new script instance based on current script
      */
    function requeuescript() {
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/confirmation-dialog/confirmation-dialog.view.html',
        controller: 'ConfirmationDialogController',
        controllerAs: 'confirmationDialogCtrl',
        resolve: {
          confirmationText: function confirmationText() {
            return 'This will re-submit the script for execution. Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function (accept) {
        if (accept) {
          var scriptData = vm.script;
          ScriptsManager.createScript(scriptData).then(function (script) {
            scope.scriptId = script.id;
            vm.script = script;
          });
        }
      });
    }
  }
})();
//# sourceMappingURL=view-script-details.controller.js.map
