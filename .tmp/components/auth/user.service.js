'use strict';

(function () {

  function UserResource($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      changeTheme: {
        method: 'PUT',
        params: {
          controller: 'theme'
        }
      }
    });
  }

  angular.module('angularFullstackApp.auth').factory('User', UserResource);
})();
//# sourceMappingURL=user.service.js.map
