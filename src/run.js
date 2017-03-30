const port = parseInt(process.argv[2], 10)
const isRunSaveServer = process.argv[3] === 'true' ? true : false

// --- 保存サーバ
if (isRunSaveServer) {
	require('./apiEntry')(port)
}

// --- 実際のサーバ
require('./mock')(port)
