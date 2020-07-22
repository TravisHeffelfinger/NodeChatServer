const fs = require("fs");
const net = require("net");

process.stdin.setEncoding("utf8");

let connectedUsers = [];
class Client {
  constructor(name, id, socket) {
    this.name = name;
    this.id = id;
    this.socket = socket;
  }
}
function idGenerator() {
  return Math.floor(Math.random() * 1000000);
}
const server = net.createServer((socket) => {
  let client = new Client(`Guest${connectedUsers.length + 1}`, idGenerator() ,socket);
  connectedUsers.push(client);
  socket.write(`Welcome to the server ${client.name}!`);
  console.log(`connections: ${connectedUsers.length}`);

  socket.on("end", () => {
    connectedUsers.filter((user, index) => {
      user.id !== client.id ? user.socket.write(`${client.id} has disconnected`): connectedUsers.splice(index);
    });
    
  });

  socket.on("error", (err) => {
    console.log(err);
  });
  socket.on("data", (data) => {
    let message = data.toString().trim();
    console.log(message);
    connectedUsers.filter((user) => {
      if (user.id !== client.id) user.socket.write(`${client.name}: ${message}`);
    });
  });
});

server.listen(3000, () => console.log('server listening on port: 3000'));
