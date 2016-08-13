(function() {
  'use strict';

  angular
    .module('admin-lte')
    .controller('MainSidebarController', MainSidebarController);

  MainSidebarController.$inject = ['menuService'];

  function MainSidebarController(menuService) {
    var vm = this;
    vm.menu = menuService.getMenu('nav');
  }
})();

