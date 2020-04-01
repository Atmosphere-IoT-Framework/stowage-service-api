
// Make sure we are running node 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 7 || (major === 7 && minor <= 5)) {
  console.log('Older version of node, upload to 7.6 or greater\n');
  process.exit();
}
console.log('Node version: ' + process.versions.node);

// Import environmental variables from variables.[ENVIRONMENT].env file (default dev)
if(process.argv[2] === undefined) process.argv[2] = 'dev';
if(!['dev', 'prod', 'test', 'docker'].includes(process.argv[2])) {
  console.log('Unknown environment (' + process.argv[2] + '), please run with dev, prod, test, docker or http \n');
  process.exit();
}
if(process.argv[2] == 'docker') require('dotenv').config({ path: '/init/variables.env' });
else require('dotenv').config({ path: 'variables.' + process.argv[2] + '.env' });
console.log(process.argv[2].toUpperCase() + ' Environment');

// Start database
const db = require('./database.js');

// Create SuperAdmin
const factory = require('./commons/factory.js');
factory.createSuperAdministrator();

// Authentication
require('./security/authentication.js');

// Start the micro-service
const server = require('./server.js');
