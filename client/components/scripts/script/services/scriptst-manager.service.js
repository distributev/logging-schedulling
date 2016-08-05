(function() {
  'use strict';

  angular
    .module('flowScripts')
    .provider('ScriptsManager', ScriptsManager);

  //ScriptsManager.$inject = ['$resource', '$q', 'Script'];

  function ScriptsManager() {
    var autoRefreshInterval = 60000;

    this.setAutoRefreshInterval = function(value) {
      autoRefreshInterval = value;
    };
    this.$get = function($resource, $q, $interval, Script) {
      var resources = $resource('api/scripts/:scriptId', {
        scriptId: '@_id',
      }, {
        searchScripts: {
          url: 'api/scripts/search?q=:searchText',
          method: 'GET',
          isArray: true
        },
        getScripts: {
          url: 'api/scripts/:type/:state/:from..:to/:order?',
          method: 'GET',
          isArray: true,
          params: {
            from: 0,
            to: 9,
            order: 'desc'
          }
        },
        getAllScriptsByScriptType: {
          url: 'api/scripts/:type/:from..:to',
          method: 'GET',
          isArray: true,
          params: {
            from: 0,
            to: 9
          }
        },
        getStats: {
          url: 'api/scripts/stats',
          method: 'GET'
        },
        getStatsByScriptType: {
          url: 'api/scripts/:type/stats',
          method: 'GET'
        },
        getTypes: {
          url: 'api/scripts/types',
          method: 'GET',
          isArray: true
        },
        start: {
          url: 'api/scripts/start',
          method: 'GET'
        },
        shutDown: {
          url: 'api/scripts/shutdown',
          method: 'GET'
        },
        getProcessStatus: {
          url: 'api/scripts/status',
          method: 'GET'
        }
      });

      var scriptsManager = {
        _pool: {},
        _retrieveInstance: function(scriptId, scriptData) {
          var instance = this._pool[scriptId];

          if (instance) {
            instance.setData(scriptData);
          } else {
            instance = new script(scriptData);
            this._pool[scriptId] = instance;
          }

          return instance;
        },
        _removeInstance: function(scriptId) {
          var instance = this._pool[scriptId];

          if (instance) {
            delete this._pool[scriptId];
          }

          return instance;
        },
        _search: function(scriptId) {
          return this._pool[scriptId];
        },
        _load: function(scriptId, deferred) {
          var self = this;
          resources.get({ scriptId: scriptId }, function(result) {
            if (result && result.id) {
              var script = self._retrieveInstance(scriptId, result);
              deferred.resolve(script);
            } else {
              var errorMessage = result.error || 'script "' + scriptId + '" doesn\'t exist';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
        },
        /* Public Methods */
        /* Use this function in order to get a script instance by it's id */
        getScript: function(scriptId) {
          var deferred = $q.defer();
          var script = this._search(scriptId);
          if (script) {
            deferred.resolve(script);
          } else {
            this._load(scriptId, deferred);
          }
          return deferred.promise;
        },
        refreshScript: function(scriptId) {
          var deferred = $q.defer();
          this._load(scriptId, deferred);
          return deferred.promise;
        },
        createScript: function(scriptData) {
          var deferred = $q.defer();
          var self = this;
          resources.save(null, scriptData, function(result) {
            if (result && result.id) {
              var scriptId = result.id;
              self.getscript(scriptId).then(function(script) {
                deferred.resolve(script);
              });
            } else {
              deferred.reject({}); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        deleteScript: function(scriptId) {
          var deferred = $q.defer();
          var self = this;
          resources.delete({ scriptId: scriptId }, function(result) {
            if (result && result.message) {
              self._removeInstance(scriptId);
              deferred.resolve(result.message);
            } else {
              var errorMessage = result.error || 'Failed to delete script';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        /* Use this function in order to get instances of all the scripts */
        loadScripts: function(params) {
          var deferred = $q.defer();
          var self = this;
          if (params.type && !params.state) {
            resources.getAllScriptsByscriptType(params, function(result) {
              if (result && !result.error) {
                var scripts = [];
                result.forEach(function(scriptData) {
                  var scriptId = scriptData.id;
                  var script = self._retrieveInstance(scriptId, scriptData);
                  scripts.push(script);
                });
                deferred.resolve(scripts);
              } else {
                var errorMessage = result.error || 'Failed to fetch scripts';
                deferred.reject(errorMessage); // TODO: Handle error response
              }
            });
          } else {
            resources.getScripts(params, function(result) {
              if (result && !result.error) {
                var scripts = [];
                result.forEach(function(scriptData) {
                  var scriptId = scriptData.id;
                  var script = self._retrieveInstance(scriptId, scriptData);
                  scripts.push(script);
                });
                deferred.resolve(scripts);
              } else {
                var errorMessage = result.error || 'Failed to fetch scripts';
                deferred.reject(errorMessage); // TODO: Handle error response
              }
            });
          }
          return deferred.promise;
        },
        searchScripts: function(searchText) {
          var deferred = $q.defer();
          var self = this;
          var params = {
            searchText: searchText
          };
          resources.searchScripts(params, function(result) {
            if (result && !result.error) {
              var promises = [];
              result.forEach(function(scriptId) {
                promises.push(self.getscript(scriptId));
              });
              $q.all(promises).then(function(res) {
                deferred.resolve(res);
              });
            } else {
              var errorMessage = result.error || 'Failed to fetch scripts';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        getTypes: function() {
          var deferred = $q.defer();
          resources.getTypes({}, function(result) {
            if (result && !result.error) {
              deferred.resolve(result);
            } else {
              var errorMessage = result.error || 'Failed to delete script';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        getStats: function(scriptType) {
          var deferred = $q.defer();
          if (scriptType) {
            resources.getStatsByscriptType({
              type: scriptType
            }, function(result) {
              if (result && !result.error) {
                var stats = {};
                for (var stat in result) {
                  if (Script.states.indexOf(stat) > -1) {
                    stats[stat] = result[stat];
                  }
                }
                deferred.resolve(stats);
              } else {
                var errorMessage = result.error || 'Failed to delete script';
                deferred.reject(errorMessage); // TODO: Handle error response
              }
            });
          } else {
            resources.getStats({}, function(result) {
              if (result && !result.error) {
                var stats = {};
                for (var key in result) {
                  if (result.hasOwnProperty(key) && key.indexOf('Count') > -1) {
                    var label = key.substring(0, key.indexOf('Count'));
                    var count = result[key];
                    stats[label] = count;
                  }
                }
                deferred.resolve(stats);
              } else {
                var errorMessage = result.error || 'Failed to delete script';
                deferred.reject(errorMessage); // TODO: Handle error response
              }
            });
          }
          return deferred.promise;
        },
        startAllscripts: function() {
          var deferred = $q.defer();
          resources.start({}, function(result) {
            if (result && !result.error) {
              deferred.resolve(result.message);
            } else {
              var errorMessage = result.error || 'Failed to delete script';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        stopAllscripts: function() {
          var deferred = $q.defer();
          resources.shutDown({}, function(result) {
            if (result && !result.error) {
              deferred.resolve(result.message);
            } else {
              var errorMessage = result.error || 'Failed to delete script';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        isScriptProcessRunning: function() {
          var deferred = $q.defer();
          resources.getProcessStatus({}, function(result) {
            deferred.resolve(result.status === 'running');
          });
          return deferred.promise;
        }
      };
      return scriptsManager;
    };
  }
})();
