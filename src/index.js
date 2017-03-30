const forever = require('forever-monitor')

const fs = require('fs')
const util = require('./json-stub-server/util')

const config = require('./json-stub-server/config.js')
const dbPath = process.cwd() + '/'+ config.db
const backupPath = process.cwd() + '/'+ config.backup

function run(...sources) {

	var configParam

	if (sources.length === 1) {
		configParam = Object.assign({}, config,  sources[0])
	}
	else {
		configParam = config
	}

	const foreverProcess = new (forever.Monitor)(`${__dirname}/json-stub-server/run.js`, {
		args: [configParam.port, configParam.isRunSaveServer]
	}).start()

	if (!util.fileCheck(dbPath)) {
		util.writeJSON(dbPath, [config.defaultData])
	}

	if (!util.fileCheck(backupPath)) {
		util.writeJSON(backupPath, [config.defaultData])
	}

	util.readJSON(dbPath)

	watch(dbPath, ()=> {
			foreverProcess.restart()
		})
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
