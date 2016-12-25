var forever = require('forever-monitor')
var fs = require('fs')

var config = require('./config.js')
var dbPath = process.cwd() + '/'+ config.db

var foreverProcess = null

console.log(`${__dirname}/run.js`)

function run() {
  foreverProcess = new forever.Monitor(`${__dirname}/run.js`).start()

  watch(dbPath)

}

function watch(target, _callback) {

  console.log(`watch => ${target}`)

  fs.watch(target, (eventType, filename) => {


    console.log(filename)
    console.log(`event type is: ${eventType}`)

    if (eventType === 'change') {
      foreverProcess.restart()
    }
  })
}

module.exports = run
