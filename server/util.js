var _ = require('lodash')

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
}