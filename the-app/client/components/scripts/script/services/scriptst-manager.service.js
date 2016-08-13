/*(function() {
  'use strict';

  angular
    .module('flowScripts')
    .provider('ScriptsManager', ScriptsManager);

  //ScriptsManager.$inject = ['$resource', '$q', 'Script'];

  function ScriptsManager() {

    this.$get = function($resource, $interval) {
      var resources = $resource('api/scripts/');

      var scriptsManager = {
          getScripts : function(){
            var scripts =  resources.query();
            return scripts.$promise;
          }    
      };

      return scriptsManager;
    };
  }
})();
*/