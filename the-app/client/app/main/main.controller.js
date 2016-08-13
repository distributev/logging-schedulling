'use strict';

(function() {

  class MainController {

    constructor() {}
  }

  angular.module('angularFullstackApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
