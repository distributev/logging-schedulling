/*Winston setup file*/
/*set up log path*/
/*work to complete */
/*Work on formatter function to produce msg pattern: %d{dd/MM/yyyy HH:mm:ss} %p - %m%n*/
/*Log rotate files */

"use strict"
const winston = require("winston");
const fs = require('fs');
const path = require("path");
const dirPath = path.dirname(path.dirname(__dirname));
const fullPath = path.join(dirPath,"/logs");
const debug = false;
var logDirExist = false;

//setting up logger
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
        	name :'file-info',
            level: 'info',
            filename: '../../logs/info.log',
            handleExceptions: true,
            json: false,
            maxSize: 10485760, 
            maxFiles: 10,
            prettyPrint :true,
            formatter : formatter
            
        }),
        new winston.transports.File({
        	name :'file-debug',
            level: 'debug',
            filename: '../../logs/debug.log',
            handleExceptions: true,
            json: false,
            maxSize: 10485760, 
            maxFiles: 10,
            prettyPrint :true,
            formatter : formatter
            
        }),
         new winston.transports.File({
         	name :'file-error',
            level: 'error',
            filename: '../../logs/error.log',
            handleExceptions: true,
            json: false,
            maxSize: 10485760, 
            maxFiles: 10,
            prettyPrint :true,
            formatter : formatter
            
        }),
          new winston.transports.File({
            name :'file-warn',
            level: 'warn',
            filename: '../../logs/warnings.log',
            handleExceptions: true,
            json: false,
            maxSize: 10485760, 
            maxFiles: 10,
            prettyPrint :true,
            formatter : formatter
           
        })
    ],
    exitOnError: false
});


var log = {
	debug : function(msg){
		logFxn(logger,msg,"debug");
	},
	info : function(msg){
		logFxn(logger,msg,"info");
	},
	warning : function(msg){
		logFxn(logger,msg,"warn");
	},
	error : function(msg){
		logFxn(logger,msg,"error");
	}
}

var formatter = function(options){
	return options.timestamp() +' ['+ options.level.toUpperCase() +'] '+ (undefined !== options.message ? options.message : '') +
     (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}

var setup = function(){
	
	if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
      logDirExist = true;
}else{
	logDirExist = true;
}
   
  if(logDirExist){
  		return true;
  }else{
     return false;	
  }
  
};
 var logFxn = function(logger,msg,level){
      if(setup()){
      	switch(level){
     	case "info":
            
     		logger.info(msg);
     		break;
     	case "debug":
     	   if(debug){
     		 logger.debug(msg);
     		}else{//exception will be added subsequently
     			
     			logger.log(msg);
     		}
     	    break
     	case "error":
     		logger.error(msg);
     		break;
     	case "warning":
     	    logger.warn(msg);
     	     break;
     	default:
     	    logger.log(msg);
     }

      }
     
}
module.exports = log;