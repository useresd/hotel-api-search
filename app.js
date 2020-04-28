const express = require('express');
const app = express();
const http = require('http');
const routes = require('./routes');

app.use(express.json());
app.use('/', routes);

const server = http.createServer(app);
server.listen(8002, () => {
    console.log("Server up and running!");
})