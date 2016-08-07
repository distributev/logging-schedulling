'use strict';

(function () {
  'use strict';

  angular.module('kueJobs').controller('ViewJobDetailsController', ViewJobDetailsController);

  ViewJobDetailsController.$inject = ['$scope', '$interval', '$uibModal', 'JobsManager'];

  function ViewJobDetailsController($scope, $interval, $uibModal, JobsManager) {
    var scope = $scope;
    var jobIdWatcher = null;
    var refreshDataInterval = null;
    var vm = this;
    vm.message = 'Loading job...';
    vm.deleteJob = deleteJob;
    vm.onclose = onclose;
    vm.requeueJob = requeueJob;

    activate();

    function activate() {
      if (!scope.autoRefreshInterval) {
        scope.autoRefreshInterval = 60000;
      }

      /**
       * Job id watcher
       */
      jobIdWatcher = scope.$watch('jobId', function (newValue) {
        if (refreshDataInterval) {
          $interval.cancel(refreshDataInterval);
        }

        if (newValue) {
          JobsManager.getJob(newValue).then(function (job) {
            vm.job = job;
          }, function (err) {
            vm.message = err;
          });

          refreshDataInterval = $interval(function () {
            refreshJob();
          }, scope.autoRefreshInterval);
        } else {
          vm.message = 'Job ID is required';
        }
      });
    }

    /**
     * On destroy handling
     */
    scope.$on('$destroy', function () {
      if (jobIdWatcher) {
        jobIdWatcher();
      }

      if (refreshDataInterval) {
        $interval.cancel(refreshDataInterval);
      }
    });

    /**
     * Delete current job
     */
    function deleteJob() {
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/confirmation-dialog/confirmation-dialog.view.html',
        controller: 'ConfirmationDialogController',
        controllerAs: 'confirmationDialogCtrl',
        resolve: {
          confirmationText: function confirmationText() {
            return 'This will permanently delete the job. Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function (accept) {
        if (accept) {
          JobsManager.deleteJob(scope.jobId).then(function (message) {
            vm.job = null;
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
          jobId: scope.jobId
        });
      }
    }

    /**
     * Refresh current job
     */
    function refreshJob() {
      JobsManager.refreshJob(scope.jobId).then(function (job) {
        vm.job = job;
      });
    }

    /**
      * Requeue job i.e. create new job instance based on current job
      */
    function requeueJob() {
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/confirmation-dialog/confirmation-dialog.view.html',
        controller: 'ConfirmationDialogController',
        controllerAs: 'confirmationDialogCtrl',
        resolve: {
          confirmationText: function confirmationText() {
            return 'This will re-submit the job for execution. Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function (accept) {
        if (accept) {
          var jobData = vm.job;
          JobsManager.createJob(jobData).then(function (job) {
            scope.jobId = job.id;
            vm.job = job;
          });
        }
      });
    }
  }
})();
//# sourceMappingURL=view-job-details.controller.js.map
