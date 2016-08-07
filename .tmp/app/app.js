'use strict';

angular.module('angularFullstackApp', ['angularFullstackApp.auth', 'angularFullstackApp.admin', 'angularFullstackApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'ui.router', 'ui.bootstrap', 'validation.match', 'Menus']).config(function ($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);
}).run(['menuService', 'Auth', '$timeout', '$rootScope', function (menuService) {
  menuService.addMenu('nav', {
    roles: ['user']
  });

  menuService.addMenuItem('nav', {
    title: 'Customers',
    state: 'customers',
    type: 'dropdown',
    roles: ['user'],
    class: 'fa fa-dashboard'
  });

  menuService.addMenuItem('nav', {
    title: 'Transactions',
    state: 'transactions',
    type: 'dropdown',
    roles: ['user'],
    class: 'fa fa-files-o'
  });

  menuService.addMenuItem('nav', {
    title: 'Jobs',
    state: 'jobs.all',
    type: 'dropdown',
    roles: ['user'],
    class: 'fa fa-check-square-o'
  });
  menuService.addMenuItem('nav', {
    title: 'Flows',
    state: 'scripts.all',
    type: 'dropdown',
    roles: ['user'],
    class: 'fa fa-file-code-o'
  });
  menuService.addSubMenuItem('nav', 'jobs.all', {
    title: 'All',
    state: 'jobs.all',
    roles: ['user'],
    type: 'item',
    class: 'fa fa-check-square-o'
  });
  menuService.addSubMenuItem('nav', 'jobs.all', {
    title: 'Email Jobs',
    state: 'jobs.type({jobType:"email"})',
    type: 'item',
    roles: ['user'],
    class: 'fa fa-envelope-o'
  });

  menuService.addSubMenuItem('nav', 'jobs.all', {
    title: 'Start/Stop Jobs',
    state: 'jobs.startStop',
    type: 'item',
    roles: ['user'],
    class: 'fa fa-play'
  });

  menuService.addSubMenuItem('nav', 'scripts.all', {
    title: 'All',
    state: 'scripts.all',
    type: 'item',
    roles: ['user'],
    class: 'fa fa-file-code-o'
  });

  menuService.addSubMenuItem('nav', 'scripts.all', {
    title: 'Startup',
    state: 'scripts.type({scriptType:"startUp"})',
    type: 'item',
    roles: ['user'],
    class: 'fa fa-arrow-circle-up'
  });

  menuService.addSubMenuItem('nav', 'scripts.all', {
    title: 'Shutdown',
    state: 'scripts.type({scriptType:"shutDown"})',
    type: 'item',
    roles: ['user'],
    class: 'fa fa-arrow-circle-down'
  });
  menuService.addSubMenuItem('nav', 'scripts.all', {
    title: 'Schedules',
    state: 'scripts.type({scriptType:"schedules"})',
    type: 'item',
    roles: ['user'],
    class: 'fa fa-calender-check-o'
  });
}]);
//# sourceMappingURL=app.js.map
