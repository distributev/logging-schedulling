/*next work,make logger automatically accessible*/
"use strict"
const winston = require("winston");
const fs = require('fs');
const path = require("path");
const dirPath = path.dirname(path.dirname(__dirname));
const fullPath = path.join(dirPath,"/logs");
const   DEBUG = false;
//steps to accomplish 
//create categories for each log level
//formating files

//create log directory if not exists
if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
    }  
//format time
function formatter(options){
     // Return string will be passed to logger. 
    return options.timestamp() +' '+ options.level.toUpperCase() +' - ********'+ (undefined !== options.message ? options.message : '') +
         ' - ' + (options.meta && Object.keys(options.meta).length ? '\t'+ JSON.stringify(options.meta) + '******': '' );
      }

//format timestamp
function tsFormat(){
    var timestamp = new Date();
    var date = timestamp.toLocaleDateString();
    var time = timestamp.toLocaleTimeString();
    return date + " " + time;
}

 // Configure the logger for `info` 
winston.loggers.add('info', {
    transports :[
       new (require('winston-daily-rotate-file'))({
            filename: '../../logs/info.log',
            timestamp: tsFormat,
            datePattern: 'dd-MM-yyyy',
            prepend: true,
			json :false,
			prettyPrint :true,
            level: 'info',
            formatter:formatter
        })
    ]
  });
winston.loggers.add('warn', {
    transports :[
       new (require('winston-daily-rotate-file'))({
            filename: '../../logs/warn.log',
            timestamp: tsFormat,
            datePattern: 'dd-MM-yyyy',
			json :false,
			prettyPrint :true,
            prepend: true,
            level: 'warn',
            formatter:formatter
        })
    ]
  });
winston.loggers.add('error', {
    transports :[
       new (require('winston-daily-rotate-file'))({
            filename: '../../logs/error.log',
            timestamp: tsFormat,
            datePattern: 'dd-MM-yyyy',
			json :false,
			prettyPrint :true,
            prepend: true,
            level: 'error',
            formatter:formatter
        })
    ]
  });
if(DEBUG){
     winston.loggers.add('debug', {
    transports :[
       new (require('winston-daily-rotate-file'))({
            filename: '../../logs/debug.log',
            timestamp: tsFormat,
            datePattern: 'dd-MM-yyyy',
            prepend: true,
			json :false,
			prettyPrint :true,
            level: 'debug',
            formatter:formatter
        })
    ]
  });
     }
//log object
var log = {};



log.info = function(arg1){
    var logger = winston.loggers.get('info');
     logger.info.apply(this,arguments);
} 
log.warning = function(arg1){
    var logger = winston.loggers.get('warn');
     logger.warn.apply(this,arguments);
} 
log.error = function(arg1){
    var logger = winston.loggers.get('error');
     logger.error.apply(this,arguments);
} 
log.debug = function(arg1){
    var logger = winston.loggers.get('debug');
     logger.debug.apply(this,arguments);
} 

module.exports = log;
