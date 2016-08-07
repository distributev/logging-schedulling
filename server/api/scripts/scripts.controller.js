'use strict';
/**
 * Start job queue
 */
export  function allScript(req, res) {
  res.status(200).json([{
    'state': 'activated',
    'location' : '/flows/015-shutdown/script0.js',
    'nextRun' : 20

  },
   {
    'state': 'deactivated',
    'location' : '/flows/010-startup/_script1.js',
    'nextRun' : 5

  },
  {
    'state': 'activated',
    'location' : '/flows/020-shedules/script3.js',
    'nextRun' : 10

  },
  {
    'state': 'activated',
    'location' : '/flows/015-shutdown/script4.js',
    'nextRun' : 15

  },
  {
    'state': 'deactivated',
    'location' : '/flows/020-schedule/script5.js',
    'nextRun' : 5

  },
  {
    'state': 'activated',
    'location' : '/flows/010-shutup/script6.js',
    'nextRun' : 5

  }]);
 }

