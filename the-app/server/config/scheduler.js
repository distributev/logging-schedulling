'use strict';

import kueScheduler from 'kue-scheduler';
import config from './environment';
import fs  from 'fs';
import path from 'path';
var rootPath = path.dirname(__dirname) + path.sep + 'flows' + path.sep;
var q  = kue_scheduler.createQueue({
	disableSearch: true,
  redis: require(path.join(config.root, config.redis.configPath)).redis
});

//create jobs for startup process
	q.createJob('startup' , {
		'location' : rootPath + '010 - startup' + path.sep + 'script1.js',
		'nextRun' : 'reStart',
	})   'activated' : true
	 .priority('high')
	 .now();

	q.createJob('startup' , {
		'location' : rootPath + '010 - startup' + path.sep + 'script2.js',
		'nextRun' : 'reStart',
	})   'activated' : true
	 .priority('high')
	 .now();
	q.createJob('startup' , {
		'location' : rootPath + '010 - startup' + path.sep + 'script3.js',
		'nextRun' : 'reStart',
	})   'activated' : true
	 .priority('high')
	 .now(); 															
//create schedule jobs
	q.createJob('schedules' , {
		'location' : rootPath + '020 - schedules' +path.sep + 'print hello world from laterjs every 15 seconds.js',
		'nextRun' : 15,
	})   'activated' : true
	 .priority('high')
	 .every('15 seconds');

	 q.createJob('schedules' , {
		'location' : rootPath + '020 - schedules' + path.sep + 'print hello world from cron every 10 seconds',
		'nextRun' : 10,
	})   'activated' : true
	 .priority('high')
	 .every('15 seconds');
 //shutdown jobs
 	q.createJob('shutdown' , {
		'location' : rootPath + '015 - shutdown' + path.sep + 'shutdown.js',
		'nextRun' : 'shutdown',
	})   'activated' : true
	 .priority('high')
	 .every('1 seconds');

	q.createJob('shutdown' , {
		'location' : rootPath + '015 - shutdown' + path.sep + 'shutdown1.js',
		'nextRun' : 'shutdown',
	})   'activated' : true
	 .priority('high')
	 .every('1 seconds');



function isDeactivated(fileFullPath){
     //check if file exists
     var fstats = fs.statSync(fileFullPath);
     if(!fstats){
     	//since file or directory does not exist ,get parent directory
     	var parent = path.dirname(fileFullPath);
     	var child = '_' + path.basename(fileFullPath);
     	//loop through the parent children and compare with children
     	var parentChildren = fs.readdirSync(parent);
     	var deactivated = false;
     	//loop through the array of files /folders
     	for(var file = 0 ;file < parentChildren.length ;file++){
              if(child === parentChildren[file]){
              	 deactivated = true;
              	 break;
              }
     	} 
     	//check if there was a match
     	if(deactivated){
     		return true;
     	}else
     	return 'scriptDoesNotExist';
     }else if(fstats){
     	return false;
     }
}
function runScript(job,done){
	//check if file exist
	var fileFullPath = job.data.location;
	var fstats = fs.statSync(fileFullPath);
	if(fstats){
		//check if location is a folder
		if(fstats.isDirectory()){
			//append schedule.js
            var file = fileFullPath + path.sep + 'schedule.js';
            var resolvePath = path.resolve(file);
            //we check if file exist
            var fstats2 = fs.statSync(fileFullPath);
            if(fstats2){
            	//execute script
            	execScript(file);

            }else{
            	done('could not run script because: ' + resolvePath + 'does not exist');
            }
		}
		//check if location is a file
		if(fstats.isFile()){
			execScript(path.resolve(fileFullPath));
		}
	}
}

function execScript(scriptPath){

}