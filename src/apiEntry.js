var express = require('express')
var opn = require('opn')
var app = express()
var config = require('./config.js')
var util = require('./util.js')
var fs = require('fs')
var _ = require('lodash')

var bodyParser = require('body-parser')

app.use(express.static('public'))
app.use(bodyParser.json())  // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))  // for parsing application/x-www-form-urlencoded


module.exports = (port) => {


  function createJSON(newData, index, db, config) {

    // create data
    if (index == -1) {
      data = config.defaultData
      data.created = util.getNow()

      db.push(_.defaults(newData, data))

    }
    else {
      data = db[index]

      // バックアップ
      util.backup(data, config.backup)

      db[index] = _.defaults(newData, {version: data.version+1}, data)
    }

    util.writeJSON(config.db, db)
  }

  // add/update response data
  app.get(`${config.api.req}/*`, (req, res) => {
    console.log('req.path => ',req.path)

    var apiPath = req.path.replace(config.api.req, '')
    var db = util.readJSON(config.db)
    var data = null

    // find request
    var index = util.getDBIndex(db, {
        id: apiPath,
        request: {
          method: req.method
        }
      })

    // create request
    var newData = {
      id: apiPath,
      updated: util.getNow(),
      request: {
        body: req.body,
        method: req.method,
        params: req.query,
      }
    }


    createJSON(newData, index, db, config)

    res.send(db)
  })


  // add/update request data
  app.post(`${config.api.res}/*`, (req, res) => {
    var apiPath = req.path.replace(config.api.res, '')
    var db = util.readJSON(config.db)

    // JSONの中からリクエストが一致するデータを取得する
    var index = util.getDBIndex(db, {
        id: apiPath,
        request: {
          method: 'GET'
        }
      })
    var data = null

    var newData = {
      id: apiPath,
      updated: util.getNow(),
      response: {
        body: req.body,
        httpStatus: 200,
      }
    }

    createJSON(newData, index, db, config)

    res.send(db)

  })

  app.listen(port+1)

  var uri = `http://localhost:${port+1}/apimock/request/abcde`

  // open browser uri
  // opn(uri)
  console.log(uri)





}

