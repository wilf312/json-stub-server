var forever = require('forever-monitor')
var spawn = require('child_process').spawn

var fs = require('fs')
var util = require('./json-stub-server/util')

var config = require('./json-stub-server/config.js')
var cwd = process.cwd()
var dbPath = `${cwd}/${config.db}`
var backupPath = `${cwd}/${config.backup}`

function run(...sources) {

  var configParam

  if (sources.length === 1) {
    configParam = Object.assign({}, config,  sources[0])
  }
  else {
    configParam = config
  }


  // forever起動
  var runNode = spawn(
    'node',
    [
      `${__dirname}/json-stub-server/run.js`,
      configParam.port,
      configParam.isRunSaveServer,
    ],
    {
      cwd: __dirname,
      env: process.env
    });
  // var foreverProcess = new (forever.Monitor)(`${__dirname}/json-stub-server/run.js`, {
  //   args: [configParam.port, configParam.isRunSaveServer]
  // }).start()

  if (!util.fileCheck(dbPath)) {
    util.writeJSON(dbPath, [config.defaultData])
  }

  if (!util.fileCheck(backupPath)) {
    util.writeJSON(backupPath, [config.defaultData])
  }

  util.readJSON(dbPath)

  watch(dbPath, ()=> {
      // foreverProcess.restart()

      runNode.kill()

      setTimeout(() => {
        runNode
      }, 1000)
  })

  runNode.stdout.on('data', function (data) {
    console.log('stdout: ' + data)
  })

  runNode.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
  })

  // On 'SIGINT' 
  process.on('SIGINT', () => {

    runNode.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });

    // If the child took too long to exit
    // Kill the child, and exit with a failure code
    setTimeout(() => {
      runNode.kill();
      process.exit(1);
    }, 3000);

  });
}

function watch(target, _callback) {

  fs.watch(target, (eventType, filename) => {
    if (eventType === 'change') {
      util.readJSON(dbPath)
      _callback()
    }
  })
}

module.exports = run
