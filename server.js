const fs = require("fs");
const net = require("net");

process.stdin.setEncoding("utf8");

let chatLog = fs.createWriteStream('./chat-log.txt')

let connectedUsers = [];


function getOtherClients(socket) {
  return connectedUsers.filter(index => index !== socket);
}

function getCurrentClient(socket) {
  return connectedUsers.indexOf(socket) + 1
}

const server = net.createServer((socket) => {
  socket.write("Welcome to the server!");
  connectedUsers.push(socket);
  console.log(`${connectedUsers.length} users currently connected`);
  chatLog.write(`User${getCurrentClient(socket)} connected.`)

  socket.on("end", () => {
    socket.end
  });

  socket.on("error", (err) => {
    console.log(err);
  });
  socket.on("data", (input) => {
    let output = `User${getCurrentClient(socket)}: ${input.toString().trim()}`
    console.log(output);
    if(connectedUsers.length > 1){ 
    let currentUsers = getOtherClients(socket)
    currentUsers.map((user) => user.write(output))
    chatLog.write(output)
    } else {
      chatLog.write(output)
    }
    
  });
});

server.listen(3000, () => {
  console.log('server is up');
});
