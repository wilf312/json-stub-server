var express = require('express')
var fs = require('fs')
var config = require('./config.js')
var util = require('./util.js')
var _ = require('lodash')


module.exports = (port) => {
  var mockServer = express()
  var mockPort = port
  var db = util.readJSON(config.db)
  var uri = `http://localhost:${mockPort}`


  console.log('\nstart mock server....\n')

  // set response
  _.forEach(db, function(value, key) {
    const m = value.request.method.toLowerCase()
    const method = m != null && m != '' ? m : 'all'
    const apiPath = value.id

    console.log(`request path: ${uri+apiPath}`)

    mockServer[method](apiPath, (req, res) => {
      // set response headers
      res.header('Content-Type', 'application/json; charset=utf-8')
      res.charset = 'utf-8'

      res.json(value.response.body)
    })
  })

  mockServer.listen(mockPort)

  console.log(`\nserver running: ${uri}`)


}

