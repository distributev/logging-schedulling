var wincmd = require('../_internal/tools/node-windows');
var Service = wincmd.Service;
var fs = require('fs');

// Create a new service object
var svc = new Service({
  name:'TheAppService',
  script: require('path').join(__dirname,'../_internal/app/server'),
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();