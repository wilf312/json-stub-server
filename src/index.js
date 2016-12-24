var fs = require('fs')
var util = require('./util')
var config = require('./config.js')
var dbPath = process.cwd() + '/'+ config.db
var backupPath = process.cwd() + '/'+ config.backup

module.exports = () => {

  console.log(`dbPath: ${dbPath}`)
  if (!fs.existsSync(dbPath) ) {
  // if (true) {
    console.log('no exists.')

    util.writeJSON(dbPath, [config.defaultData])
  }

  console.log(`backupPath: ${backupPath}`)
  if (!fs.existsSync(backupPath) ) {
  // if (true) {
    console.log('no exists.')

    util.writeJSON(backupPath, [config.defaultData])
  }


  var apiEntry = require('./apiEntry')
  apiEntry()

  var mock = require('./mock')
  mock()

}