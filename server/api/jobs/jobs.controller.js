'use strict';

var config = require('../../config/environment'),
    kue = require('kue'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    path = require('path'),
    Job = kue.Job;

var queue = kue.createQueue({
    disableSearch: true,
    redis: require(path.join(config.root, config.redis.configPath)).redis
  });

queue.on('error', function(err) {
  console.log('Oops, there is some problem with redis. ', err);
});

var baseApiUrl = 'http://localhost:' + config.port + '/api';
var jobStatus = 'running';
var jobStates = [
  'active',
  'complete',
  'delayed',
  'failed',
  'inactive'
];

/**
 * Get job queue status
 */
export function status(req, res) {
  res.status(200).json({
    status: jobStatus
  });
}

/**
 * Start job queue
 */
export function start(req, res) {
  if (jobStatus === 'running') {
    res.status(400).json({
      error: 'Kue is already running'
    });
  } else {
    queue = kue.createQueue({
      disableSearch: true,
      redis: require(path.join(config.root, config.redis.configPath)).redis
    });

    queue.on('error', function(err) {
      console.log('Oops, there is some problem with redis. ', err);
    });

    jobStatus = 'running';
    res.status(200).json({
      message: 'Re-create queue'
    });
  }
}

/**
 * Shut down job queue
 */
export function shutdown(req, res) {
  queue.shutdown(5000, function(err) {
    if (err) {
      return res.status(400).send({
        error: err.message
      });
    }
    jobStatus = 'shutdown';
    res.status(200).json({
      message: 'Successfully shut down kue'
    });
  });
}

/**
 * Custom get jobs by job type
 */
export function getJobsByJobType(req, res) {
  var type = req.params.jobType;
  var from = req.params.from;
  var to = parseInt(req.params.to) + 1;

  var promises = [];
  jobStates.forEach(function(state) {
    var promise = new Promise(function(resolve, reject) {
      Job.rangeByType(type, state, 0, 10000, null, function(err, jobs) {
        if (err) {
          return reject(err);
        }
        resolve(jobs);
      });
    });

    promises.push(promise);
  });

  Promise.all(promises).then(function(results) {
    var jobs = [];
    results.forEach(function(result) {
      jobs = jobs.concat(result);
    });
    jobs = _.orderBy(jobs, ['created_at'], ['desc']);
    jobs = _.slice(jobs, from, to);
    res.status(200).json(jobs);

  }, function(err) {
    var errorMessage = err.message || 'Something went wrong';
    return res.status(400).send({
      error: errorMessage
    });
  })
}

/**
 * Custom get job stats by job type
 */
export function getJobStatsByJobType(req, res) {
  var type = req.params.jobType;

  var promises = [];
  jobStates.forEach(function(state) {
    var promise = new Promise(function(resolve, reject) {
      queue.cardByType(type, state, function( err, count ) {
        if (err) {
          return reject(err);
        }

        resolve({
          count: count,
          state: state
        });
      });
    });
    promises.push(promise);
  });

  Promise.all(promises).then(function(results) {
    var stats = {};
    results.forEach(function(result) {
      stats[result.state] = result.count;
    });
    res.status(200).json(stats);
  }, function(err) {
    var errorMessage = err.message || 'Something went wrong';
    return res.status(400).send({
      error: errorMessage
    });
  });
}
