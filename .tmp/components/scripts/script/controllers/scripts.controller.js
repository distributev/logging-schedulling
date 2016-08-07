'use strict';

(function () {
  'use strict';

  angular.module('flowScripts').controller('ScriptController', ScriptController);

  ScriptController.$inject = [];

  function ScriptController() {
    var vm = this;
    vm.selectedScriptIds = [];
    vm.onclose = onclose;
    vm.ontoggle = ontoggle;

    activate();

    function activate() {}

    function onclose(scriptId) {
      var selectedScriptIds = vm.selectedScriptIds.filter(function (value) {
        return value !== scriptId;
      });
      vm.selectedScriptIds = selectedScriptIds;
    }

    function ontoggle(selectedScriptIds) {
      vm.selectedScriptIds = selectedScriptIds;
    }
  }
})();
//# sourceMappingURL=scripts.controller.js.map
