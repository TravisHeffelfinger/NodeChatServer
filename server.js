const fs = require("fs");
const net = require("net");

process.stdin.setEncoding("utf8");

let chatLog = fs.createWriteStream('./chat-log.txt')

let connectedUsers = [];

function getOtherClients(socket) {
  return connectedUsers.filter(index => { if (index !== socket && index !== null) return index });
}

function getCurrentClient(socket, ending) {
  if (ending) sendMessage(socket, clientDisconnect(socket));
  return connectedUsers.indexOf(socket) + 1
}

function sendMessage(socket, userMessage) {
  let output = `User${getCurrentClient(socket)}: ${userMessage.toString().trim()}`
  console.log(output);
  if (connectedUsers.length > 1) {
    let currentUsers = getOtherClients(socket)
    currentUsers.map((user) => user.write(output))
    chatLog.write(output)
  } else {
    chatLog.write(output)
  }
}

function updateClientCount() {
  let count = 0;
  connectedUsers.filter(index => {
    if (index !== null) {
      count++
    } else {
      count--
    }
  })
  return count;
}

function clientDisconnect(sock) {
  let index = getCurrentClient(sock);
  console.log('before ', connectedUsers.length)
  connectedUsers.filter((user) => {
    if (user === sock) {
      user.destroy(err => {
        console.log(err)
      })
      user = null;
      console.log(connectedUsers.length)
    }
  });
  updateClientCount();
  return `has disconnected`

}
const server = net.createServer((socket) => {
  socket.write("Welcome to the server!");
  connectedUsers.push(socket);
  console.log(`${updateClientCount()} users currently connected`);
  chatLog.write(`User${getCurrentClient(socket)} connected.`)

  socket.on("end", () => {
    socket.end(console.log(`User${getCurrentClient(socket, true)} disconnected.`))
  });

  socket.on("error", (err) => {
    console.log(err);
  });
  socket.on("data", (input) => {
    sendMessage(socket, input);
  });
});

server.listen(3000, () => {
  console.log('server is up');
});
