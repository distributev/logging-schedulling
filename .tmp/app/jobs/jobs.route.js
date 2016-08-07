'use strict';

angular.module('angularFullstackApp').config(function ($stateProvider) {
  $stateProvider.state('jobs', {
    url: '/jobs',
    template: '<div ui-view></div>',
    abstract: true
  }).state('jobs.all', {
    url: '/',
    templateUrl: 'app/jobs/jobs.html',
    controller: 'JobsController',
    controllerAs: 'vm',
    breadcrumb: {
      label: 'Jobs'
    }
  }).state('jobs.startStop', {
    url: '/startstop',
    template: '<start-stop-jobs></start-stop-jobs>',
    breadcrumb: {
      label: 'Start/Stop Jobs'
    }
  }).state('jobs.type', {
    url: '/:jobType',
    templateUrl: 'app/jobs/jobs.html',
    controller: 'JobsController',
    controllerAs: 'vm',
    resolve: {
      jobType: ['$stateParams', function ($stateParams) {
        return $stateParams.jobType;
      }]
    },
    breadcrumb: {
      label: '{{ jobType }} Jobs'
    }
  });
});
//# sourceMappingURL=jobs.route.js.map
