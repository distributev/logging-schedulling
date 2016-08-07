'use strict';

(function () {
  'use strict';

  angular.module('kueJobs').controller('StartStopJobsController', StartStopJobsController);

  StartStopJobsController.$inject = ['$uibModal', 'JobsManager'];

  function StartStopJobsController($uibModal, JobsManager) {
    var vm = this;
    vm.jobProcessingStatus = true;
    vm.shutDownAllJobs = shutDownAllJobs;
    vm.startAllJobs = startAllJobs;

    activate();

    function activate() {
      JobsManager.getTypes().then(function (types) {
        vm.jobTypes = types;
      });

      JobsManager.isJobProcessRunning().then(function (isRunning) {
        vm.jobProcessingStatus = isRunning;
      });
    }

    function shutDownAllJobs() {
      // vm.jobProcessingStatus = !vm.jobProcessingStatus;
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/confirmation-dialog/confirmation-dialog.view.html',
        controller: 'ConfirmationDialogController',
        controllerAs: 'confirmationDialogCtrl',
        resolve: {
          confirmationText: function confirmationText() {
            return 'This will stop all the jobs. Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function (accept) {
        if (accept) {
          JobsManager.stopAllJobs().then(function () {
            vm.jobProcessingStatus = false;
          }, function () {
            vm.jobProcessingStatus = true;
          });
        }
      });
    }

    function startAllJobs() {
      JobsManager.startAllJobs().then(function () {
        vm.jobProcessingStatus = true;
      }, function () {
        vm.jobProcessingStatus = false;
      });
    }
  }
})();
//# sourceMappingURL=start-stop-jobs.controller.js.map
