'use strict';

(function () {
  'use strict';

  angular.module('kueJobs').provider('JobsManager', JobsManager);

  // JobsManager.$inject = ['$resource', '$q', 'Job'];

  function JobsManager() {
    var autoRefreshInterval = 60000;

    this.setAutoRefreshInterval = function (value) {
      autoRefreshInterval = value;
    };
    this.$get = function ($resource, $q, $interval, Job) {
      var resources = $resource('api/kue/job/:jobId', {
        jobId: '@_id'
      }, {
        searchJobs: {
          url: 'api/kue/job/search?q=:searchText',
          method: 'GET',
          isArray: true
        },
        getJobs: {
          url: 'api/kue/jobs/:type/:state/:from..:to/:order?',
          method: 'GET',
          isArray: true,
          params: {
            from: 0,
            to: 9,
            order: 'desc'
          }
        },
        getAllJobsByJobType: {
          url: 'api/jobs/kue/:type/:from..:to',
          method: 'GET',
          isArray: true,
          params: {
            from: 0,
            to: 9
          }
        },
        getStats: {
          url: 'api/kue/stats',
          method: 'GET'
        },
        getStatsByJobType: {
          url: 'api/jobs/kue/:type/stats',
          method: 'GET'
        },
        getTypes: {
          url: 'api/kue/job/types',
          method: 'GET',
          isArray: true
        },
        start: {
          url: 'api/jobs/start',
          method: 'GET'
        },
        shutDown: {
          url: 'api/jobs/shutdown',
          method: 'GET'
        },
        getProcessStatus: {
          url: 'api/jobs/status',
          method: 'GET'
        }
      });
      var jobsManager = {
        _pool: {},
        _retrieveInstance: function _retrieveInstance(jobId, jobData) {
          var instance = this._pool[jobId];

          if (instance) {
            instance.setData(jobData);
          } else {
            instance = new Job(jobData);
            this._pool[jobId] = instance;
          }

          return instance;
        },
        _removeInstance: function _removeInstance(jobId) {
          var instance = this._pool[jobId];

          if (instance) {
            delete this._pool[jobId];
          }

          return instance;
        },
        _search: function _search(jobId) {
          return this._pool[jobId];
        },
        _load: function _load(jobId, deferred) {
          var self = this;
          resources.get({ jobId: jobId }, function (result) {
            if (result && result.id) {
              var job = self._retrieveInstance(jobId, result);
              deferred.resolve(job);
            } else {
              var errorMessage = result.error || 'Job "' + jobId + '" doesn\'t exist';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
        },
        /* Public Methods */
        /* Use this function in order to get a job instance by it's id */
        getJob: function getJob(jobId) {
          var deferred = $q.defer();
          var job = this._search(jobId);
          if (job) {
            deferred.resolve(job);
          } else {
            this._load(jobId, deferred);
          }
          return deferred.promise;
        },
        refreshJob: function refreshJob(jobId) {
          var deferred = $q.defer();
          this._load(jobId, deferred);
          return deferred.promise;
        },
        createJob: function createJob(jobData) {
          var deferred = $q.defer();
          var self = this;
          resources.save(null, jobData, function (result) {
            if (result && result.id) {
              var jobId = result.id;
              self.getJob(jobId).then(function (job) {
                deferred.resolve(job);
              });
            } else {
              deferred.reject({}); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        deleteJob: function deleteJob(jobId) {
          var deferred = $q.defer();
          var self = this;
          resources.delete({ jobId: jobId }, function (result) {
            if (result && result.message) {
              self._removeInstance(jobId);
              deferred.resolve(result.message);
            } else {
              var errorMessage = result.error || 'Failed to delete job';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        /* Use this function in order to get instances of all the jobs */
        loadJobs: function loadJobs(params) {
          var deferred = $q.defer();
          var self = this;
          if (params.type && !params.state) {
            resources.getAllJobsByJobType(params, function (result) {
              if (result && !result.error) {
                var jobs = [];
                result.forEach(function (jobData) {
                  var jobId = jobData.id;
                  var job = self._retrieveInstance(jobId, jobData);
                  jobs.push(job);
                });
                deferred.resolve(jobs);
              } else {
                var errorMessage = result.error || 'Failed to fetch jobs';
                deferred.reject(errorMessage); // TODO: Handle error response
              }
            });
          } else {
            resources.getJobs(params, function (result) {
              if (result && !result.error) {
                var jobs = [];
                result.forEach(function (jobData) {
                  var jobId = jobData.id;
                  var job = self._retrieveInstance(jobId, jobData);
                  jobs.push(job);
                });
                deferred.resolve(jobs);
              } else {
                var errorMessage = result.error || 'Failed to fetch jobs';
                deferred.reject(errorMessage); // TODO: Handle error response
              }
            });
          }
          return deferred.promise;
        },
        searchJobs: function searchJobs(searchText) {
          var deferred = $q.defer();
          var self = this;
          var params = {
            searchText: searchText
          };
          resources.searchJobs(params, function (result) {
            if (result && !result.error) {
              var promises = [];
              result.forEach(function (jobId) {
                promises.push(self.getJob(jobId));
              });
              $q.all(promises).then(function (res) {
                deferred.resolve(res);
              });
            } else {
              var errorMessage = result.error || 'Failed to fetch jobs';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        getTypes: function getTypes() {
          var deferred = $q.defer();
          resources.getTypes({}, function (result) {
            if (result && !result.error) {
              deferred.resolve(result);
            } else {
              var errorMessage = result.error || 'Failed to delete job';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        getStats: function getStats(jobType) {
          var deferred = $q.defer();
          if (jobType) {
            resources.getStatsByJobType({
              type: jobType
            }, function (result) {
              if (result && !result.error) {
                var stats = {};
                for (var stat in result) {
                  if (Job.states.indexOf(stat) > -1) {
                    stats[stat] = result[stat];
                  }
                }
                deferred.resolve(stats);
              } else {
                var errorMessage = result.error || 'Failed to delete job';
                deferred.reject(errorMessage); // TODO: Handle error response
              }
            });
          } else {
            resources.getStats({}, function (result) {
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
                var errorMessage = result.error || 'Failed to delete job';
                deferred.reject(errorMessage); // TODO: Handle error response
              }
            });
          }
          return deferred.promise;
        },
        startAllJobs: function startAllJobs() {
          var deferred = $q.defer();
          resources.start({}, function (result) {
            if (result && !result.error) {
              deferred.resolve(result.message);
            } else {
              var errorMessage = result.error || 'Failed to delete job';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        stopAllJobs: function stopAllJobs() {
          var deferred = $q.defer();
          resources.shutDown({}, function (result) {
            if (result && !result.error) {
              deferred.resolve(result.message);
            } else {
              var errorMessage = result.error || 'Failed to delete job';
              deferred.reject(errorMessage); // TODO: Handle error response
            }
          });
          return deferred.promise;
        },
        isJobProcessRunning: function isJobProcessRunning() {
          var deferred = $q.defer();
          resources.getProcessStatus({}, function (result) {
            deferred.resolve(result.status === 'running');
          });
          return deferred.promise;
        }
      };
      return jobsManager;
    };
  }
})();
//# sourceMappingURL=jobs-manager.service.js.map
