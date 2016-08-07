'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarController =
//end-non-standard

//start-non-standard
function NavbarController(Auth) {
  _classCallCheck(this, NavbarController);

  this.isLoggedIn = Auth.isLoggedIn;
  this.isAdmin = Auth.isAdmin;
  this.getCurrentUser = Auth.getCurrentUser;
};

angular.module('angularFullstackApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=navbar.controller.js.map
