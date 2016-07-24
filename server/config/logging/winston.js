/*Winston setup file*/
/*set up log path*/
/*create log api for logging*/

"use strict"
const winston = require("winston");
const fs = require('fs');
const path = require("path");
const dirPath = path.dirname(path.dirname(__dirname));
const fullPath = dirPath + "/logs";
//define paths of log files
const debug = fullPath + "/debug.log";
const warning = fullPath + "/warning.log";
const error = fullPath + "/error.log";
const info = fullPath +"/info.log";
var logDirExist = false;

exports.debug = function(){
	
	return log(debug ,"debug");
};
exports.warning = function(){
	
	return log(warning ,"warn");
};
exports.info = function(){
	
	return log(info ,"info");
};
exports.error = function(){
	
	return log(error ,"error");
};

var setup = function(){
	
	if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath);
}else{
	logDirExist = true;
}
   
  if(logDirExist){
  		return true;
  }else{
     return false;	
  }
  
};
 var log = function(path ,level){
 	if(setup()){
    fs.openSync(path , "a+");
    console.log(path);
     var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({ filename: path ,level: level })
    ]
  });
     switch(level){
     	case "info":
     		return logger.info;
     		break;
     	case "debug":
     		return logger.debug;
     		break;
     	case "error":
     		return logger.error;
     		break;
     	case "warning":
     	     return logger.warn;
     	     break;
     	default:
     	  return logger.log;
     }
	}
    else{
    	return winston.log;
    }
}
