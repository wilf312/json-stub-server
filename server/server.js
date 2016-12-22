var express = require('express')
var opn = require('opn')
var app = express()
var config = require('./config.js')
var util = require('./util.js')
var fs = require('fs')
var _ = require('lodash')

var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get(`${config.api.req}/*`, (req, res) => {
  // console.log(req)
  // console.log(res)
  console.log('req.path => ',req.path)
  var apiPath = req.path.replace(config.api.req, '')
  var db = JSON.parse(fs.readFileSync(config.db))
  var backup = JSON.parse(fs.readFileSync(config.backup))

  // JSONの中からリクエストが一致するデータを取得する
  var index = util.getDBIndex(db, {
      id: apiPath,
      request: {
        method: req.method
      }
    })
  var data = null

  var newData = {
    id: apiPath,
    updated: util.getNow(),
    request: {
      body: req.body,
      method: req.method,
      params: req.query,
    }
  }


  // データなければデフォルトデータ取得
  if (index == null) {
    data = config.defaultData
    data.created = util.getNow()

    // データ登録
    db.push(_.defaults(newData, data))
    fs.writeFile(config.db, JSON.stringify(db, null, '    '));

  }
  else {
    data = db[index]

    // バックアップ
    backup.push(data)
    fs.writeFile(config.backup, JSON.stringify(backup, null, '    '));

    console.log('index -> ', index);

    // データ登録
    db[index] = _.defaults(newData, {version: data.version+1}, data)
    fs.writeFile(config.db, JSON.stringify(db, null, '    '));

  }


  res.send(db)
})


// レスポンスデータ登録
app.post(`${config.api.res}/*`, (req, res) => {
  // console.log(req)
  // console.log(res)
  var apiPath = req.path.replace(config.api.res, '')
  var db = JSON.parse(fs.readFileSync(config.db))
  var backup = JSON.parse(fs.readFileSync(config.backup))

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


  // データなければデフォルトデータ取得
  if (index == -1) {
    data = config.defaultData
    data.created = util.getNow()

    // データ登録
    db.push(_.defaults(newData, data))
    fs.writeFile(config.db, JSON.stringify(db, null, '    '));

  }
  else {
    data = db[index]
    console.log(data)

    // バックアップ
    backup.push(data)
    fs.writeFile(config.backup, JSON.stringify(backup, null, '    '));

    console.log('index -> ', index);

    // データ登録
    db[index] = _.defaults(newData, {version: data.version+1}, data)
    fs.writeFile(config.db, JSON.stringify(db, null, '    '));

  }
  res.send(db)

})

app.listen(config.port)

var uri = `http://localhost:${config.port}/apimock/request/abcde`

// open browser uri
// opn(uri)


var mockServer = express()



var db = JSON.parse(fs.readFileSync(config.db))

console.log(db)


_.forEach(db, function(value, key) {
  console.log(key);
  mockServer[value.request.method.toLowerCase()](value.id, (req, res) => {
    res.send(JSON.stringify(value.response.body))
  })
});

mockServer.listen(config.port+1)

var uri = `http://localhost:${config.port+1}/abcde`

// open browser uri
// opn(uri)