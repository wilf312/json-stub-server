var _ = require('lodash')
var fs = require('fs')

module.exports = {
  getLatestData(db, filter) {
    return _.chain(db)
      .filter(filter)
      .sortBy('version')
      .reverse()
      .head()
      .value()
  },
  getDBIndex(db, filter) {
    return _.findIndex(db, filter)
  },
  getNow() {
    return Math.floor( (new Date).getTime() / 1000 )
  },
  readJSON(filePath) {
    return JSON.parse(fs.readFileSync(filePath))
  },
  writeJSON(filePath, data) {
    var JSONString = JSON.stringify(data, null, '    ')
    return fs.writeFileSync(filePath, JSONString, 'utf8')
  },
  backup(data, backupPath) {

    var backup = this.readJSON(backupPath)

    backup.push(data)

    this.writeJSON(backupPath, backup)
  },
  fileCheck(filePath) {
    if (fs.existsSync(filePath) ) {
      return true
    }
    else {
      console.log(`no exists. ${filePath}`)
      return false
    }
  },
}