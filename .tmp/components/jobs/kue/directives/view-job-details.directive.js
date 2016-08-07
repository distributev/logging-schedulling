'use strict';

(function () {
  'use strict';

  angular.module('kueJobs').directive('viewJobDetails', viewJobDetails);

  viewJobDetails.$inject = [];

  function viewJobDetails() {
    return {
      templateUrl: 'components/jobs/kue/views/view-job-details.view.html',
      restrict: 'E',
      scope: {
        jobId: '=', // the ID of the job to view details of
        autoRefreshInterval: '@', // auto-refresh the job details autoRefreshInterval ms - default value is 60 000 ms (1 minute)
        showRequeueButton: '=', // if TRUE then show the Requeue button otherwise don't show default value is TRUE
        onclose: '&'
      },
      controller: 'ViewJobDetailsController',
      controllerAs: 'viewJobDetailsCtrl'
    };
  }
})();
//# sourceMappingURL=view-job-details.directive.js.map
