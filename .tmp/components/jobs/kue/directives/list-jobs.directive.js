'use strict';

(function () {
  'use strict';

  angular.module('kueJobs').directive('listJobs', listJobs);

  listJobs.$inject = [];

  function listJobs() {
    return {
      templateUrl: 'components/jobs/kue/views/list-jobs.view.html',
      restrict: 'E',
      scope: {
        jobType: '@', // if provided the rendered table will list only the jobs of type jobType; otherwise render all jobs no matter of their type
        perPage: '@', // number of rows to display on a single page when using pagination. - default value is 10
        autoRefreshInterval: '@',
        ontoggle: '&'
      },
      controller: 'ListJobsController',
      controllerAs: 'listJobsCtrl'
    };
  }
})();
//# sourceMappingURL=list-jobs.directive.js.map
