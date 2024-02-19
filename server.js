// server.js
const WebSocket = require('ws');
const pty = require('node-pty');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  if (process.platform === "win32") {
    const term = pty.spawn('cmd.exe', [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.USERPROFILE,
      env: process.env
    });
  } else {
    const term = pty.spawn('/bin/bash', [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: process.env.USERPROFILE,
      env: process.env
    });
  }

  term.on('data', function(data) {
    ws.send(data.toString());
  });

  ws.on('message', function(message) {
    term.write(message);
  });

  ws.on('close', function() {
    term.kill();
  });
});
