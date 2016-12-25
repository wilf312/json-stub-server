var express = require('express')
var fs = require('fs')
var config = require('./config.js')
var util = require('./util.js')
var _ = require('lodash')
var mockServer = null
var server = null

var mockPort = config.port+1


function run() {

  if (mockServer || server) {
    return
  }


  mockServer = express()
  var db = util.readJSON(config.db)
  console.log(db[0].response)
  var uri = `http://localhost:${mockPort}`


  console.log('\nstart mock server....\n')

  // set response
  _.forEach(db, function(value, key) {
    const method = value.request.method.toLowerCase()
    const apiPath = value.id

    console.log(`request path: ${uri+apiPath}`)
    console.log(`value.response.body: ${value.response.body.test}`)

    mockServer[method](apiPath, (req, res) => {
      // set response headers
      res.header('Content-Type', 'application/json; charset=utf-8')
      res.charset = 'utf-8'

      // no cache
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
      res.header('Expires', '-1')
      res.header('Pragma', 'no-cache')

      console.log(value.response.body)
      res.json(value.response.body)
    })
  })

  server = mockServer.listen(mockPort)

  console.log(`\nserver running: ${uri}`)
}

function restart() {
  console.log('restart...')

  if (!server) {
    run()
  }
  else {
    console.log(`server closing... ${mockPort}`)
    server.close(()=> {
      console.log(`server close success!`)

      run()
    })
    server = null
    mockServer = null
  }
}



module.exports = {
  run: run,
  restart: restart,
}

