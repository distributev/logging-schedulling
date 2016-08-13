"use strict"

var log = require("./winston");


log.info("hello info",["2","boy","girls"]);
log.warning("hello warning",["2","boy","girls"]);
//log.debug("hello debug");
log.error("An error",["2","boy","girls"]);