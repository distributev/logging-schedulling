'use strict';

(function () {
  'use strict';

  angular.module('flowScripts').controller('ListScriptsController', ListScriptsController);

  ListScriptsController.$inject = ['$scope', '$q', '$interval', '$compile', '$uibModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'Script'];

  function ListScriptsController($scope, $q, $interval, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, Script) {
    var scope = $scope;
    var refreshDataInterval = null;
    var vm = this;
    var titleHtml = vm.scriptType;
    vm.dtInstance = {};
    vm.dtColumns = {};
    vm.data = Script.getScripts();
    var perPage = vm.perPage || 10;
    //refres data
    $interval(refreshData, 5000);

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(getTableData).withDataProp('data').withOption('responsive', true).withOption('pageLength', perPage).withOption('createdRow', function (row) {
      // Recompiling so we can bind Angular directive to the DT
      $compile(angular.element(row).contents())(scope);
    }).withPaginationType('full_numbers').withDOM('lrtip'); // remove searching
    var refreshData = function refreshData() {
      vm.data = Script.getScripts();
    };

    var listScripts = function listScripts() {
      //print out the columns
      vm.dtColumns = [DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().withOption('width', '15px').renderWith(function (data, type, full) {
        return '<input type="checkbox" ng-click="listJobsCtrl.toggleOne()">';
      }), DTColumnBuilder.newColumn('state').withTitle('State').notSortable(), DTColumnBuilder.newColumn('location').withTitle('Location').notSortable(), DTColumnBuilder.newColumn('nextRun').withTitle('Next run').notSortable()];
    };
    var getTableData = function getTableData() {
      var deferred = $q.defer();
      deferred.resolve(vm.data);
      return deferred.promise;
    };
  }
})();
//# sourceMappingURL=list-scripts.controller.js.map
