var fs = require('fs')
var util = require('./util')
var config = require('./config.js')
var dbPath = process.cwd() + '/'+ config.db
var backupPath = process.cwd() + '/'+ config.backup
var watch = require('./watch.js')


module.exports = () => {

  console.log(`dbPath: ${dbPath}`)
  if (!fs.existsSync(dbPath) ) {
    console.log('no exists.')

    util.writeJSON(dbPath, [config.defaultData])
  }

  console.log(`backupPath: ${backupPath}`)
  if (!fs.existsSync(backupPath) ) {
    console.log('no exists.')

    util.writeJSON(backupPath, [config.defaultData])
  }


  var apiEntry = require('./apiEntry')
  apiEntry()

  var mock = require('./mock')
  mock.run()


  watch(dbPath, () => {
    console.log('watch callback')
    mock.restart()
  })

}