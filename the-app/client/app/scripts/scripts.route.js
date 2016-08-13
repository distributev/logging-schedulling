'use strict';

angular.module('angularFullstackApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('scripts', {
        url: '/scripts',
        template: '<div ui-view></div>',
        abstract: true
      })
      .state('scripts.all', {
        url: '/',
        templateUrl: 'app/scripts/scripts.html',
        controller: 'ScriptsController',
        controllerAs: 'vm',
        breadcrumb: {
          label: 'Scripts'
        }
      })
      .state('scripts.type', {
        url: '/:scriptType',
        templateUrl: 'app/scripts/scripts.html',
        controller: 'ScriptsController',
        controllerAs: 'vm',
        resolve: {
          scriptType: ['$stateParams', function($stateParams) {
            return $stateParams.scriptType;
          }]
        },
        breadcrumb: {
          label: '{{ scriptType }} scripts'
        }
      });
  });
