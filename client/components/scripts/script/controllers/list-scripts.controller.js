(function() {
  'use strict';

  angular
    .module('flowScripts')
    .controller('ListScriptsController', ListScriptsController);

  ListScriptsController.$inject = ['$scope', '$q', '$interval', '$compile', '$uibModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'ScriptsManager', 'Script'];

  function ListScriptsController($scope, $q, $interval, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, ScriptsManager, Script) {
    var scope = $scope;
    var refreshDataInterval = null;
    var vm = this;
    vm.dtInstance = {};
    vm.lastRowClicked = null;
    vm.selectedScripts = {};
    vm.selectAll = false;
    vm.selectedScriptType = {
      label: 'Show All'
    };
    vm.selectedState = {
      label: 'Show All'
    };
    vm.showAllStatesCount = 0;
    vm.deleteSelectedScripts = deleteSelectedScripts;
    vm.refreshScripts = refreshScripts;
    vm.toggleAll = toggleAll;
    vm.toggleOne = toggleOne;
    vm.toggleState = toggleState;
    vm.toggleType = toggleType;

    var perPage = scope.perPage || 10;
    var titleHtml = '<input type="checkbox" ng-model="listScriptsCtrl.selectAll" ng-click="listScriptsCtrl.toggleAll()">';

    

    activate();

    function activate() {
      if (!scope.autoRefreshInterval) {
        scope.autoRefreshInterval = 60000;
      }

      if (scope.scriptType) {
        var scriptType = scope.scriptType;
        vm.selectedScriptType = {
          label: scriptType,
          value: scriptType
        };
      }
      vm.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', function(data, callback) {
          // if (data.order) {
          //   data.order.forEach(function(order) {
          //
          //   });
          // }

          if (refreshDataInterval) {
            $interval.cancel(refreshDataInterval);
          }

          vm.selectAll = false; // reset select all
          vm.selectedScripts = {}; // reset selected items

          var search = data.search ? data.search.value : null;

          var promises = {};
          if (search) {
            promises.data = ScriptsManager.searchScripts(search);
            promises.recordsTotal = ScriptsManager.getStats().then(function(stats) {
              var recordsTotal = 0;
              for (var state in stats) {
                var count = stats[state];
                recordsTotal += count;
              }
              return recordsTotal;
            });

            $q.all(promises).then(function(results) {
              var filterScripts = results.data.slice(data.start, data.length + data.start);
              var ScriptsData = {
                recordsTotal: results.recordsTotal,
                recordsFiltered: results.data.length,
                data: filterScripts
              };
              callback(ScriptsData);
            });

          } else {
            /**
             *  columns
             draw
             length: 50
             order: Array[1]
             page: 1, 2, 3
             search: Object
             start: 0

             0..49, 50..99
             */
            var from = data.start;
            var to = (from + data.length) - 1;
            var params = {
              from: from,
              to: to
            };
            if (vm.selectedState && vm.selectedState.value) {
              params.state = vm.selectedState.value;
            }
            if (vm.selectedScriptType && vm.selectedScriptType.value) {
              params.type = vm.selectedScriptType.value;
            }
            promises.data = ScriptsManager.loadScripts(params);
            promises.stats = ScriptsManager.getStats(params.type).then(function(stats) {
              var recordsTotal = 0;
              var recordsFiltered = 0;

              for (var state in stats) {
                var count = stats[state];
                recordsTotal += count;

                if (state === params.state) {
                  recordsFiltered = count;
                }
              }

              recordsFiltered = params.state ? recordsFiltered : recordsTotal;

              return {
                recordsTotal: recordsTotal,
                recordsFiltered: recordsFiltered
              };
            });

            $q.all(promises).then(function(results) {
              var ScriptsData = {
                recordsTotal: results.stats.recordsTotal,
                recordsFiltered: results.stats.recordsFiltered,
                data: results.data
              };
              callback(ScriptsData);
            });
          }

          refreshDataInterval = $interval(function() {
            vm.refreshScripts();
          }, scope.autoRefreshInterval);
        })
        .withDataProp('data')
        .withOption('language', {

        })
        .withOption('responsive', true)
        .withOption('pageLength', perPage)
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('createdRow', function(row) {
          // Recompiling so we can bind Angular directive to the DT
          $compile(angular.element(row).contents())(scope);
        })
        .withOption('headerCallback', function(header) {
          if (!vm.headerCompiled) {
            // Use this headerCompiled field to only compile header once
            vm.headerCompiled = true;
            $compile(angular.element(header).contents())(scope);
          }
        })
        .withOption('rowCallback', rowCallback)
        .withPaginationType('full_numbers')
        .withDOM('lrtip'); // remove searching

      vm.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable().withOption('width', '15px')
          .renderWith(function(data, type, full) {
            vm.selectedScripts[full.id] = false;
            return '<input type="checkbox" ng-model="listScriptsCtrl.selectedScripts[' + data.id + ']" ng-click="listScriptsCtrl.toggleOne()">';
          }),
        DTColumnBuilder.newColumn('customState').withTitle('State').notSortable()
          .renderWith(function(data, type, full) {
            /* jshint camelcase: false */
            var stateLabelClass = full.state_label_class;
            return '<label class="label ' + stateLabelClass + '">' + data + '</label>';
          }),
        DTColumnBuilder.newColumn('state').withTitle('Type').notSortable(),
        DTColumnBuilder.newColumn('location').withTitle('Started').notSortable(),
        DTColumnBuilder.newColumn('nextRun').withTitle('Finished').notSortable()
      ];

      refreshScriptStats(scope.ScriptType);
      ScriptsManager.getTypes().then(function(types) {
        var ScriptTypes = [];
        types.forEach(function(type) {
          ScriptTypes.push({
            label: type,
            value: type
          });
        });
        vm.ScriptTypes = ScriptTypes;
      });
    }

    scope.$on('$destroy', function() {
      if (refreshDataInterval) {
        $interval.cancel(refreshDataInterval);
      }
    });

    function deleteSelectedScripts() {
      var dialogInstance = $uibModal.open({
        templateUrl: 'components/confirmation-dialog/confirmation-dialog.view.html',
        controller: 'ConfirmationDialogController',
        controllerAs: 'confirmationDialogCtrl',
        resolve: {
          confirmationText: function() {
            return 'This will permanently delete the selected Script(s). Are you sure?';
          }
        }
      });

      dialogInstance.result.then(function(accept) {
        if (accept) {
          var promises = {};
          for (var scriptId in vm.selectedScripts) {
            if (vm.selectedScripts.hasOwnProperty(ScriptId) && vm.selectedScripts[ScriptId] === true) {
              promises[scriptId] = ScriptsManager.deleteScript(ScriptId);
            }
          }

          $q.all(promises).then(function() {
            vm.refreshScripts();
          });
        }
      });
    }

    function refreshScripts() {
      var resetPaging = false;
      vm.dtInstance.reloadData(null, resetPaging);
    }

    function refreshScriptStats(scriptType) {
      ScriptsManager.getStats(scriptType).then(function(stats) {
        var totalCount = 0;
        var ScriptStatsGroups = {
          groupOne: [],
          groupTwo: []
        };
        for (var state in stats) {
          var count = stats[state];
          totalCount += count;

          if (state === 'inactive') {
            ScriptStatsGroups.groupTwo.push({
              label: 'queued',
              value: state,
              count: count,
              order: '1',
              className: Script.stateLabelMapping[state] || 'label-default'
            });
          } else if (state === 'delayed') {
            ScriptStatsGroups.groupTwo.push({
              label: state,
              value: state,
              count: count,
              order: '2',
              className: Script.stateLabelMapping[state] || 'label-default'
            });
          } else if (state === 'active') {
            ScriptStatsGroups.groupOne.push({
              label: 'running',
              value: state,
              count: count,
              order: '1',
              className: Script.stateLabelMapping[state] || 'label-default'
            });
          } else {
            ScriptStatsGroups.groupOne.push({
              label: state,
              value: state,
              count: count,
              order: '10',
              className: Script.stateLabelMapping[state] || 'label-default'
            });
          }
        }

        vm.showAllStatesCount = totalCount;
        vm.ScriptStats = ScriptStatsGroups;
      });
    }

    function rowCallback(nRow, ScriptData) {
      // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
      $('td:gt(0)', nRow).unbind('click');
      $('td:gt(0)', nRow).bind('click', function() {
        scope.$apply(function() {
          if (vm.lastRowClicked && vm.lastRowClicked !== nRow) {
            $(vm.lastRowClicked).removeClass('info');
          }
          var isRowHighlighted = $(nRow).hasClass('info');
          if (isRowHighlighted){
            $(nRow).removeClass('info');
          } else {
            $(nRow).addClass('info');
          }

          vm.lastRowClicked = nRow;

          if (angular.isFunction(scope.ontoggle)) {
            var selectedScriptIds = isRowHighlighted ? [] : [ScriptData.id];
            scope.ontoggle({
              selectedScripts: selectedScriptIds
            });
          }
        });
      });

      return nRow;
    }

    function toggleAll() {
      for (var id in vm.selectedScripts) {
        if (vm.selectedScripts.hasOwnProperty(id)) {
          vm.selectedScripts[id] = vm.selectAll;
        }
      }

      if (vm.lastRowClicked) {
        $(vm.lastRowClicked).removeClass('info');
      }

      if (angular.isFunction(scope.ontoggle)) {
        scope.ontoggle({
          selectedScripts: vm.selectAll ? Object.keys(vm.selectedScripts).reverse() : [] // biggest id comes first
        });
      }
    }

    function toggleOne() {
      var selectAll = true;
      for (var id in vm.selectedScripts) {
        if (vm.selectedScripts.hasOwnProperty(id)) {
          if (!vm.selectedScripts[id]) {
            selectAll = false;
            break;
          }
        }
      }
      vm.selectAll = selectAll;

      if (vm.lastRowClicked) {
        $(vm.lastRowClicked).removeClass('info');
      }

      if (angular.isFunction(scope.ontoggle)) {
        var selectedScriptIds = [];
        for (var ScriptId in vm.selectedScripts) {
          if (vm.selectedScripts.hasOwnProperty(ScriptId) && vm.selectedScripts[ScriptId]) {
            selectedScriptIds.push(ScriptId);
          }
        }

        scope.ontoggle({
          selectedScripts: selectedScriptIds.reverse() // biggest id comes first
        });
      }
    }

    function toggleState(state) {
      vm.selectedState = state;
      vm.refreshScripts();
    }

    function toggleType(ScriptType) {
      vm.selectedScriptType = {
        label: ScriptType.label,
        value: ScriptType.value
      };

      refreshScriptStats(ScriptType.value);

      vm.refreshScripts();
    }
  }
})();
