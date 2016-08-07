'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JobsController = function JobsController($scope, $stateParams) {
  _classCallCheck(this, JobsController);

  $scope.jobType = $stateParams.jobType;
};

angular.module('angularFullstackApp').controller('JobsController', JobsController);
//# sourceMappingURL=jobs.controller.js.map
