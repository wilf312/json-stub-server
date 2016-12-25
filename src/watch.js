var fs = require('fs')


function watch(target, _callback) {

  console.log(`watch => ${target}`)

  fs.watch(target, (eventType, filename) => {

    console.log(`event type is: ${eventType}`)

    console.log(filename)


    if (eventType === 'change') {
      if (filename) {
        console.log(`filename provided: ${filename}`)

        _callback()
      }
      else {
        console.log('filename not provided')
      }

    }



  })
}

module.exports = watch
