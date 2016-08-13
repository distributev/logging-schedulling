'use strict';

import {Router} from 'express';
import * as controller from './app.controller';

var router = new Router();

router.get('/init', controller.init);

module.exports = router;
