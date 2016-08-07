'use strict';

(function () {
  'use strict';

  angular.module('kueJobs').controller('KueJobsController', KueJobsController);

  KueJobsController.$inject = [];

  function KueJobsController() {
    var vm = this;
    vm.selectedJobIds = [];
    vm.onclose = onclose;
    vm.ontoggle = ontoggle;

    activate();

    function activate() {}

    function onclose(jobId) {
      var selectedJobIds = vm.selectedJobIds.filter(function (value) {
        return value !== jobId;
      });
      vm.selectedJobIds = selectedJobIds;
    }

    function ontoggle(selectedJobIds) {
      vm.selectedJobIds = selectedJobIds;
    }
  }
})();
//# sourceMappingURL=jobs.controller.js.map
