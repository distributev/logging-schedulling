(function() {
  'use strict';

  angular
    .module('admin-lte')
    .controller('ThemeController', ThemeController);

  ThemeController.$inject = ['$http', 'Auth', 'ThemeStyleService'];

  function ThemeController($http, Auth, ThemeStyleService) {
    var vm = this;
    vm.Auth = Auth;

    activate();

    function activate() {
      // i.e. fixes the layout height in case min-height fails.
      $(function() {
        $.AdminLTE.layout.activate();
      });
      ThemeStyleService.toggleMiniSidebar(true);

      // initialize app
      $http.get('/api/app/init');

      Auth.isLoggedIn(function(isLoggedIn) {
        if (isLoggedIn) {
          var userTheme = Auth.getCurrentUser().theme;
          ThemeStyleService.changeSkin(userTheme);
        }
      });
    }
  }
})();
