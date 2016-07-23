(function() {
  'use strict';

  angular
    .module('admin-lte')
    .controller('MainNavController', MainNavController);

  MainNavController.$inject = ['Auth'];

  function MainNavController(Auth) {
    var vm = this;
    vm.currentUser = Auth.getCurrentUser();
  }
})();

