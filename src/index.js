var forever = require('forever-monitor')
var fs = require('fs')

var config = require('./config.js')
var dbPath = process.cwd() + '/'+ config.db

function run() {
  var foreverProcess = new forever.Monitor(`${__dirname}/run.js`).start()

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
