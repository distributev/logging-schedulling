'use strict';

class ScriptsController {
  constructor($scope, $stateParams) {
    $scope.scriptType = $stateParams.scriptType;
  }
}

angular.module('angularFullstackApp')
  .controller('ScriptsController', ScriptsController);
