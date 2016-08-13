(function() {
  'use strict';

  angular
    .module('flowScripts')
    .controller('ListScriptsController', ListScriptsController);

  ListScriptsController.$inject = ['$scope', '$q', '$interval', '$compile', '$uibModal', 'DTOptionsBuilder', 'DTColumnBuilder', '$resource'];

  function ListScriptsController($scope, $q, $interval, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, $resource) {
    var scope = $scope;
    var refreshDataInterval = 10000;
    var vm = this;
    var titleHtml = vm.scriptType;
    //vm.data = Script.getScripts();
    
    var perPage = vm.perPage || 10;
    //refres data
    $interval(reloadData ,refreshDataInterval);

    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        return $resource('api/scripts/').query().$promise;
    }).withDataProp('data')
        .withOption('responsive', true)
        .withOption('pageLength', perPage)
        .withOption('createdRow', function(row) {
          // Recompiling so we can bind Angular directive to the DT
          $compile(angular.element(row).contents())(scope);
        })
        .withPaginationType('full_numbers')
        .withDOM('lrtip');
         // remove searching

    vm.newPromise = newPromise;
    vm.dtInstance = {};
    vm.dtInstance.reloadData = reloadData;
    
    function newPromise() {
        return $resource('data1.json').query().$promise;
    }

    function reloadData() {
        var resetPaging = true;
        vm.dtInstance.reloadData(callback, resetPaging);
    }

    function callback() {
        //console.log(json);
    }
    

      vm.listScripts = function(){
          //print out the columns
          vm.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().withOption('width', '15px')
          .renderWith(function() {
            return '<input type="checkbox" ng-click="listJobsCtrl.toggleOne()">';
          }),
        DTColumnBuilder.newColumn('state').withTitle('State').notSortable(),
        DTColumnBuilder.newColumn('location').withTitle('Location').notSortable(),
        DTColumnBuilder.newColumn('nextRun').withTitle('Next run').notSortable()

      ];

      }
      vm.listScripts();
      
  }
})();
