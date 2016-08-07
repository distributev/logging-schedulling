'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScriptsController = function ScriptsController($scope, $stateParams) {
  _classCallCheck(this, ScriptsController);

  $scope.scriptType = $stateParams.scriptType;
};

angular.module('angularFullstackApp').controller('ScriptsController', ScriptsController);
//# sourceMappingURL=scripts.controller.js.map
