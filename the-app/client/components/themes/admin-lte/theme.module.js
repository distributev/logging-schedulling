(function() {
  'use strict';

  angular.module('admin-lte', ['Menus']);
  angular.module('angularFullstackApp').requires.push('admin-lte');
  angular.module('angularFullstackApp').run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$state = $state;
  }]);
  angular.module('admin-lte')
    .run(function($rootScope, $state, Auth, ThemeStyleService) {
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
	      /**
         * Update user's theme skin once login/signup
         */
        if (fromState.name === 'login' || fromState.name === 'signup') {
          Auth.getCurrentUser(null)
            .then(function(user) {
              ThemeStyleService.changeSkin(user.theme);
            });
        }

	      /**
         * Use this instead of Auth.isLoggedIn() to get more accurate info
         */
        var isLoggedIn = Auth.getCurrentUser().hasOwnProperty('$promise');

        /**
         * Handler when going to login/signup page
         */
        if (toState.name === 'login' || toState.name === 'signup') {

	        /**
           * If logged in, redirect them to main page away from login/signup page!
           */
          if (isLoggedIn) {
            event.preventDefault();
            $state.go('main');
          }
        }
        /**
         * Handler when going to page other than login/signup page
         */
        else {
          /**
           * If not logged in, redirect them to login page!
           */
          if (!isLoggedIn) {
            event.preventDefault();
            $state.go('login');
          }
        }
      });
    });
})();
