'use strict';

import {Router} from 'express';
var controller = require('./scripts.controller');

var router = new Router();
router.get('', controller.allScript);
router.get('/', controller.allScript);

module.exports = router;