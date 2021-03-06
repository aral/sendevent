var sendevent = require('../../')
  , express = require('express')
  , browserify = require('browserify-middleware')
  , path = require('path')

var se = sendevent()
var app = express()

app.use(se)
app.get('/bundle.js', browserify(path.resolve(__dirname, '../browser/test.js')))
app.get('/', function(req, res) {
  res.send('<pre id="out">Waiting ...</pre><script src="/bundle.js"></script>')
  setInterval(function() {
    console.log('Sending event ...')
    se.broadcast({ time: Date.now() })
  }, 1000)
})

module.exports = app
