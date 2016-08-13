(function() {
  'use strict';

  angular
    .module('admin-lte')
    .controller('ControlSidebarController', ControlSidebarController);

  ControlSidebarController.$inject = ['ThemeStyleService'];

  function ControlSidebarController(ThemeStyleService) {

    $('[data-skin]').on('click', function (e) {
      e.preventDefault();
      ThemeStyleService.changeSkin($(this).data('skin'));
    });

    $('[data-layout]').on('click', function() {
      changeLayout($(this).data('layout'));
    });

    $('[data-toggle="control-sidebar"]').on('click', function () {
      $('.control-sidebar').toggleClass('control-sidebar-open');
    });

    $('[data-controlsidebar]').on('click', function() {
      changeLayout($(this).data('controlsidebar'));
      var slide = !$.AdminLTE.options.controlSidebarOptions.slide;
      $.AdminLTE.options.controlSidebarOptions.slide = slide;
      if (!slide) {
        $('.control-sidebar').removeClass('control-sidebar-open');
      }
    });

    $('[data-sidebarskin="toggle"]').on('click', function() {
      var sidebar = $('.control-sidebar');
      if (sidebar.hasClass('control-sidebar-dark')) {
        sidebar.removeClass('control-sidebar-dark');
        sidebar.addClass('control-sidebar-light');
      } else {
        sidebar.removeClass('control-sidebar-light');
        sidebar.addClass('control-sidebar-dark');
      }
    });

    function changeLayout(cls) {
      $('body').toggleClass(cls);
      $.AdminLTE.layout.fixSidebar();
      //Fix the problem with right sidebar and layout boxed
      if (cls === 'layout-boxed') {
        $.AdminLTE.controlSidebar._fix($('.control-sidebar-bg'));
      }
      if ($('body').hasClass('fixed') && cls === 'fixed') {
        $.AdminLTE.pushMenu.expandOnHover();
        $.AdminLTE.layout.activate();
      }
      $.AdminLTE.controlSidebar._fix($('.control-sidebar-bg'));
      $.AdminLTE.controlSidebar._fix($('.control-sidebar'));
    }
  }
})();
