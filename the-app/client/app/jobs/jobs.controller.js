'use strict';

class JobsController {
  constructor($scope, $stateParams) {
    $scope.jobType = $stateParams.jobType;
  }
}

angular.module('angularFullstackApp')
  .controller('JobsController', JobsController);
