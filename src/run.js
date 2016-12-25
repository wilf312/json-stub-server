// process start

var fs = require('fs')
var util = require('./util')
var config = require('./config.js')
var dbPath = process.cwd() + '/'+ config.db
var backupPath = process.cwd() + '/'+ config.backup

var apiEntry = require('./apiEntry')
apiEntry()

var mock = require('./mock')
mock()
