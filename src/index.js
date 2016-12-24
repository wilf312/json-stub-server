module.exports = () => {
  var apiEntry = require('./apiEntry')
  apiEntry()

  var mock = require('./mock')
  mock()
}