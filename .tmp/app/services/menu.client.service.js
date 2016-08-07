'use strict';

(function () {
  'use strict';

  function menuService() {

    var shouldRender;
    var service = {
      addMenu: function addMenu(menuId, options) {
        options = options || {};

        // Create the new menu
        service.menus[menuId] = {
          roles: options.roles || service.defaultRoles,
          items: options.items || [],
          shouldRender: shouldRender
        };

        // Return the menu object
        return service.menus[menuId];
      },
      addMenuItem: function addMenuItem(menuId, options) {
        options = options || {};

        // Validate that the menu exists
        service.validateMenuExistance(menuId);

        // Push new menu item
        service.menus[menuId].items.push({
          title: options.title || '',
          state: options.state || '',
          type: options.type || 'item',
          class: options.class,
          roles: options.roles === null || typeof options.roles === 'undefined' ? service.defaultRoles : options.roles,
          position: options.position || 0,
          items: [],
          shouldRender: shouldRender
        });

        // Add submenu items
        if (options.items) {
          for (var i in options.items) {
            if (options.items.hasOwnProperty(i)) {
              service.addSubMenuItem(menuId, options.state, options.items[i]);
            }
          }
        }

        // Return the menu object
        return service.menus[menuId];
      },
      addSubMenuItem: function addSubMenuItem(menuId, parentItemState, options) {
        options = options || {};

        // Validate that the menu exists
        service.validateMenuExistance(menuId);

        // Search for menu item
        for (var itemIndex in service.menus[menuId].items) {
          if (service.menus[menuId].items[itemIndex].state === parentItemState) {
            // Push new submenu item
            service.menus[menuId].items[itemIndex].items.push({
              title: options.title || '',
              state: options.state || '',
              roles: options.roles === null || typeof options.roles === 'undefined' ? service.menus[menuId].items[itemIndex].roles : options.roles,
              position: options.position || 0,
              shouldRender: shouldRender
            });
          }
        }

        // Return the menu object
        return service.menus[menuId];
      },
      defaultRoles: ['user', 'admin'],
      getMenu: function getMenu(menuId) {
        // Validate that the menu exists


        service.validateMenuExistance(menuId);

        // Return the menu object
        return service.menus[menuId];
      },
      menus: {},
      removeMenu: function removeMenu(menuId) {
        // Validate that the menu exists
        service.validateMenuExistance(menuId);

        delete service.menus[menuId];
      },
      removeMenuItem: function removeMenuItem(menuId, menuItemState) {
        // Validate that the menu exists
        service.validateMenuExistance(menuId);

        // Search for menu item to remove
        for (var itemIndex in service.menus[menuId].items) {
          if (service.menus[menuId].items.hasOwnProperty(itemIndex) && service.menus[menuId].items[itemIndex].state === menuItemState) {
            service.menus[menuId].items.splice(itemIndex, 1);
          }
        }

        // Return the menu object
        return service.menus[menuId];
      },
      removeSubMenuItem: function removeSubMenuItem(menuId, submenuItemState) {
        // Validate that the menu exists
        service.validateMenuExistance(menuId);

        // Search for menu item to remove
        for (var itemIndex in service.menus[menuId].items) {
          if (this.menus[menuId].items.hasOwnProperty(itemIndex)) {
            for (var subitemIndex in service.menus[menuId].items[itemIndex].items) {
              if (this.menus[menuId].items[itemIndex].items.hasOwnProperty(subitemIndex) && service.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
                service.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
              }
            }
          }
        }

        // Return the menu object
        return service.menus[menuId];
      },
      validateMenuExistance: function validateMenuExistance(menuId) {
        if (menuId && menuId.length) {
          if (service.menus[menuId]) {
            return true;
          } else {
            throw new Error('Menu does not exist');
          }
        } else {
          throw new Error('MenuId was not provided');
        }
      }
    };

    function init() {
      // A private function for rendering decision
      shouldRender = function shouldRender(user) {
        if (this.roles.indexOf('*') !== -1) {
          return true;
        } else {
          if (!user) {
            return false;
          }

          for (var userRoleIndex in user.roles) {
            if (user.roles.hasOwnProperty(userRoleIndex)) {
              for (var roleIndex in this.roles) {
                if (this.roles.hasOwnProperty(roleIndex) && this.roles[roleIndex] === user.roles[userRoleIndex]) {
                  return true;
                }
              }
            }
          }
        }

        return false;
      };

      // Adding the topbar menu
      service.addMenu('topbar', {
        roles: ['*']
      });
    }

    init();

    return service;
  }

  angular.module('Menus', []).factory('menuService', menuService);
})();
//# sourceMappingURL=menu.client.service.js.map
