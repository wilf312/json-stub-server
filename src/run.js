// process start

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });


const port = parseInt(process.argv[2], 10)

require('./apiEntry')(port)
require('./mock')(port)
