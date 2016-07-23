/* jshint camelcase: false */
(function() {
  'use strict';

  angular
    .module('kueJobs')
    .factory('Job', JobService);

  JobService.$inject = [];

  function JobService() {

    function Job(data) {
      if (data) {
        this.setData(data);
      }

      Object.defineProperty(this, 'started', {
        enumerable: true,
        configurable: false,
        get: function() {
          if (this.started_at) {
            var today = moment();
            var startedAt = this.started_at / 1000;
            var started = moment.unix(startedAt);

            if (today.diff(started, 'days') > 0) {
              return started.format('MMMM Do YYYY, h:mm:ss a');
            } else {
              return started.fromNow();
            }
          } else {
            return null;
          }
        }
      });

      Object.defineProperty(this, 'finished', {
        enumerable: true,
        configurable: false,
        get: function() {
          if (this.state === 'complete' || this.state === 'failed') {
            var today = moment();
            var finishedAt = this.updated_at / 1000;
            var finished = moment.unix(finishedAt);

            if (today.diff(finished, 'days') > 0) {
              return finished.format('MMMM Do YYYY, h:mm:ss a');
            } else {
              return finished.fromNow();
            }
          } else {
            return null;
          }
        }
      });

      Object.defineProperty(this, 'humanizeDuration', {
        enumerable: true,
        configurable: false,
        get: function() {
          return this.duration ? moment.duration(parseInt(this.duration)).humanize() : null;
        }
      });

      Object.defineProperty(this, 'dataAsString', {
        enumerable: true,
        configurable: false,
        get: function() {
          return JSON.stringify(this.data, null, 2);
        }
      });

      Object.defineProperty(this, 'customState', {
        enumerable: true,
        configurable: false,
        get: function() {
          if (this.state === 'active') {
            return 'running';
          } else if (this.state === 'inactive') {
            return 'queued';
          } else {
            return this.state;
          }
        }
      });

      Object.defineProperty(this, 'attemptsAsString', {
        enumerable: true,
        configurable: false,
        get: function() {
          return JSON.stringify(this.attempts, null, 2);
        }
      });

      Object.defineProperty(this, 'state_label_class', {
        enumerable: true,
        configurable: false,
        get: function() {
          return Job.stateLabelMapping[this.state] || 'label-default';
        }
      });
    }

    Job.states = [
      'active',
      'complete',
      'delayed',
      'failed',
      'inactive'
    ];

    Job.stateLabelMapping = {
      active: 'label-primary',
      complete: 'label-success',
      delayed: 'label-warning',
      failed: 'label-danger',
      inactive: 'label-inactive'
    };

    Job.prototype = {
      setData: function(data) {
        angular.extend(this, data);
        this.duration = data.duration || null;
        this.state = data.state || null;
      }
    };
    return Job;
  }
})();
