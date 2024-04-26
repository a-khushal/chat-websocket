"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
const httpServer = app.listen(8080);
const wss = new ws_1.WebSocketServer({ server: httpServer });
let userCount = 0;
let clients = [];
wss.on('connection', function connection(ws) {
    if (userCount >= 2) {
        ws.close(1000, "too many connections");
        return;
    }
    ws.on('error', console.error);
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client != ws && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    ws.send('Hello! Message From Server!!');
    clients.push(ws);
    userCount++;
    ws.on("close", function close() {
        clients = clients.filter(client => client != ws);
        userCount--;
    });
});
