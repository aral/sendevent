module.exports = function(url, handle) {

  if (typeof url == 'function') {
    handle = url
    url = '/eventstream'
  }

  /**
   * Iframe-fallback for browsers that don't support EventSource.
   */
  function createIframe() {
    var doc = document

    // On IE use an ActiveXObject to prevent the "throbber of doom"
    // see: http://stackoverflow.com/a/1066729
    if (window.ActiveXObject) {
      doc = new ActiveXObject("htmlfile")
      doc.write('<html><body></body></html>')

      // set a global variable to prevent the document from being garbage
      // collected which would close the connection:
      window.eventStreamDocument = doc

      // Expose a global function that can be invoked from within the iframe:
      doc.parentWindow.handleSentEvent = handle

      appendIframe(doc, url)
    }
    else {
      // Most likely an old Android device. The trick here is not to send
      // the 4KB padding, but to immediately reload the iframe after a message
      // was received.
      window.handleSentEvent = handle
      setTimeout(function() { appendIframe(document, url+'?close') }, 1000)
    }
  }

  function appendIframe(doc, url) {
    var i = doc.createElement('iframe')
    i.style.display = 'none'
    i.src = url
    doc.body.appendChild(i)
  }

  var init = function() {
    var source = null

    function connect () {
      if (source !== null) { disconnect() }

      source = new EventSource(url)
      source.onmessage = function(ev) {
       handle(JSON.parse(ev.data))
      }

      // Define a catch-all check for connection status that retries
      // if it notices that the connection is down. There are certain
      // instances when EventSource does not automatically retry and
      // this should ensure that they are all handled. On Firefox, for
      // example, if the server is restarted, it will not attempt to
      // reconnect but this will.
      var checkForConnectionInterval = setInterval(function () {
        if (source.readyState === 2 /* closed */) {
          clearInterval(checkForConnectionInterval)
          connect()
        }
      }, 3000)
    }

    function disconnect () {
      source.close()
      source = null
    }

    connect()

    // Ensure that we close the source before the page is unloaded.
    // Chrom(ium) works even if we don’t but Firefox throws a “The connection
    // to <url> was interrupted while the page was loading.” error on
    // reload and results in the connection being terminated after 30 seconds.
    window.addEventListener('beforeunload', function (event) {
      // Ensure that we close the source before the page is unloaded.
      // Chrom(ium) works even if we don’t but Firefox throws a “The connection
      // to <url> was interrupted while the page was loading.” error on reload.
      // When the host is localhost, this then results in the connection being
      // terminated after 30 seconds.
      disconnect()
    })
  }

  if (!window.EventSource) init = createIframe
  if (window.attachEvent) attachEvent('onload', init)
  else addEventListener('load', init)
}
