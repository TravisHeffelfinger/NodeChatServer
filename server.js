const fs = require("fs");
const net = require("net");

process.stdin.setEncoding("utf8");

let connectedUsers = [];

const server = net.createServer((socket) => {
  socket.write("Welcome to the server!");
  connectedUsers.push(socket);
  console.log(`there are ${connectedUsers.length} connected`);

  socket.on("end", socket.end);

  socket.on("error", (err) => {
    console.log(err);
  });
  socket.on("data", (input) => {
    console.log(input.toString().trim());
    connectedUsers.filter((index) => {
      if (index !== socket) socket.write(input);
    });
  });
});

server.listen(3000);
