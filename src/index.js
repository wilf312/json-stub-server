var forever = require('forever-monitor')
var fs = require('fs')
var util = require('./util')

var config = require('./config.js')
var dbPath = process.cwd() + '/'+ config.db
var backupPath = process.cwd() + '/'+ config.backup

function run() {
  var foreverProcess = new forever.Monitor(`${__dirname}/run.js`).start()

  util.fileCheck(dbPath)
  util.fileCheck(backupPath)

  watch(dbPath, ()=> {
      foreverProcess.restart()
    })
}

function watch(target, _callback) {

  fs.watch(target, (eventType, filename) => {
    if (eventType === 'change') {
      _callback()
    }
  })
}

module.exports = run
