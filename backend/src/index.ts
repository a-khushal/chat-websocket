import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'

const app = express()
const httpServer = app.listen(8080)

const wss = new WebSocketServer({ server: httpServer });
let userCount = 0;
let clients: WebSocket[] = []

wss.on('connection', function connection(ws) {
  if(userCount >= 2){
    ws.close(1000, "too many connections");
    return;
  }
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client != ws && client.readyState === WebSocket.OPEN) {
        client.send(data, {binary: isBinary});
      }
    });
  });
  ws.send('Hello! Message From Server!!');
  clients.push(ws);
  userCount++;

  ws.on("close", function close(){
    clients = clients.filter(client => client != ws);
    userCount--;
  })
});