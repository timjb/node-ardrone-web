#!/usr/bin/env node

var drone   = require('ardrone')
,   connect = require('connect')
,   io      = require('socket.io')
,   fs      = require('fs')

// Serve web interface
var server = connect.createServer(connect.staticProvider(__dirname + '/public'))
server.listen(8000)

// WebSocket
var socket = io.listen(server)
socket.on('connection', function(client) {
  client.on('message', function(msg) {
    if (msg.charAt(0) == '{') {
      
      var props = JSON.parse(msg)
      for (key in props) {
        if (props.hasOwnProperty(key)) {
          drone[key] = 0.4 * props[key]
        }
      }
      
    } else {
      
      var parts = msg.split(/\s/)
      var cmd = parts[0]
      var params = parts.slice(1)
      for (var i = 0, l = params.length; i < l; i++) {
        params[i] = parseFloat(params[i])
      }
      
      if (typeof drone[cmd] == 'function') {
        console.log('Command sent: "' + cmd + '" With params: [' + params.join(', ') + ']')
        drone[cmd].apply(drone, params)
      } else {
        console.log('NO SUCH COMMAND: ' + cmd)
      }
      
    }
  })
})
