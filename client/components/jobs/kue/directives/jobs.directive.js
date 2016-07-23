(function() {
  'use strict';

  angular
    .module('kueJobs')
    .directive('kueJobs', kueJobs);

  kueJobs.$inject = [];

  function kueJobs() {
    return {
      templateUrl: 'components/jobs/kue/views/jobs.view.html',
      restrict: 'E',
      scope: {
        jobType: '@'
      },
      controller: 'KueJobsController',
      controllerAs: 'kueJobsCtrl'
    };
  }
})();
