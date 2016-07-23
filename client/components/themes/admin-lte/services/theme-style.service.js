(function() {
	'use strict';

	angular
		.module('admin-lte')
		.factory('ThemeStyleService', ThemeStyleService);

	ThemeStyleService.$inject = ['Auth'];

	function ThemeStyleService(Auth) {
		var skins = [
      'skin-blue',
      'skin-black',
      'skin-red',
      'skin-yellow',
      'skin-purple',
      'skin-green',
      'skin-blue-light',
      'skin-black-light',
      'skin-red-light',
      'skin-yellow-light',
      'skin-purple-light',
      'skin-green-light'
    ];

		var themeStyleService = {
			changeSkin: function(skinClassName) {
        // set default theme if skinClassName can't be found
        if (!skinClassName || skins.indexOf(skinClassName) === -1) {
          skinClassName = skins[0];
        }

        // remove all theme classes from body
        $.each(skins, function (i) {
          $('body').removeClass(skins[i]);
        });

        // add theme class to body
        $('body').addClass(skinClassName);

        if (Auth.isLoggedIn()) {
          Auth.changeTheme(skinClassName);
        }
        return false;
			},
      toggleMiniSidebar: function(showMiniSidebar) {
        if (showMiniSidebar === true) {
          $('body').addClass('sidebar-mini');
        } else if (showMiniSidebar === false) {
          $('body').removeClass('sidebar-mini');
        } else {
          $('body').toggleClass('sidebar-mini');
        }
      }
		};
		return themeStyleService;
	}
})();
