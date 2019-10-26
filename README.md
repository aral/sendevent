# sendevent

---

## Note: this is a fork.

This fork of [sendevent](https://github.com/fgnass/sendevent). You should use the main project once the following pull requests have been merged:

### Awaiting merge

  - Fix disconnection issue on Firefox after 30 seconds of inactivity following a page reload. ([Pull request]())

I’m publishing this fork for our own internal use at [Small Technology Foundation](https://small-tech.org) in [Site.js](https://sitejs.org) and you are, of course, more than welcome to use it in your projects but please keep an eye on [Felix Gnass’s original repository](https://github.com/fgnass/sendevent) and use the module from there once the above pull requests have been merged.

Thank you, Felix, for this and for [instant](https://github.com/fgnass/sendevent) (which sendevent is used in) for making my life easier and Site.js better :)

### References on the Firefox issue

  - [WebSocket was interrupted while page is loading](https://stackoverflow.com/a/23784296)
  - [Firefox : "connection interrupted while the page was loading"](https://github.com/ratchetphp/Ratchet/issues/593)
  - [Bugzilla issue](https://bugzilla.mozilla.org/show_bug.cgi?id=712329)

__Original readme follows:__

---

Middleware to stream [server-sent events](http://en.wikipedia.org/wiki/Server-sent_events)
to the client. Browsers that don't support the EventSource interface will fall
back to a [hidden iframe](http://en.wikipedia.org/wiki/Comet_%28programming%29#Hidden_iframe).

## Server

Here is a simple [express](http://expressjs.com/) app that broadcasts a
timestamp every 10 seconds.

```js
var express = require('express');
var sendevent = require('sendevent');
var app = express();

// create a middlware that handles requests to `/eventstream`
var events = sendevent('/eventstream');

app.use(events);

// serve an empty page that just loads the browserify bundle
app.get('/', function(req, res) {
  res.end('<script src="/bundle.js"></script>');
});

// broadcast data to all connected clients every 10 seconds
setInterval(function() {
  events.broadcast({ time: Date.now() });
}, 10000);
```

### Advanced Usage

```js
// if needed you can also talk to individual clients
events.on('connect', function(client) {
  client.send({ greeting: 'hello number ' + client.id });
});

// and get notified when they disconnect
events.on('disconnect', function(client) {
  console.log('client %d disconnected', client.id);
});
```

## Client

If you use browserify you can simply require `sendevent` module:

```js
var on = require('sendevent');
on('/eventstream', function(ev) {
  console.log(ev);
});
```

### The MIT License (MIT)

Copyright (c) 2013 Felix Gnass

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
