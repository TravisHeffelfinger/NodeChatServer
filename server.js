const fs = require("fs");
const net = require("net");
const date = new Date().toISOString()
let connections = 1;
let numberOfUsers = 0;

console.clear()

process.stdin.setEncoding("utf8");

const chatLog = fs.createWriteStream('./chat-log.txt')

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

function getOtherClients(client) {
  return connectedUsers.filter(clients => { if (clients !== client) return clients });
}

function sendMessage(client, userMessage) {
  let output = `>${client.name}: ${userMessage}`
  console.log(output);
  if (connectedUsers.length > 1) {
    let otherUsers = getOtherClients(client)
    otherUsers.map((user) => user.socket.write(output))
    chatLog.write(output + date + '\n')
  } else {
    chatLog.write(output + date + '\n')
  }
}

function broadcast(message) {
  connectedUsers.map(user => user.socket.write(`<---${message}--->`))
}
async function numberOfConnections(){
   await server.getConnections((err, count) => {
    if(err) {
      console.log(err)
    } else {
      connections = count + 1;
    }
  })
  
}

const server = net.createServer((socket) => {
  numberOfUsers++;
  numberOfConnections();
  let currentClient = new Client(`Guest${numberOfUsers}`, idGenerator() ,socket);
  connectedUsers.push(currentClient);
  console.log(`${connections} users currently connected`);
  broadcast(`Welcome to the server ${currentClient.name}!`);
  chatLog.write(`${currentClient.name} connected. ${date}\n`)

  socket.on("end", () => {
    connectedUsers.filter((user, index) => {
      if(user.id === currentClient.id) connectedUsers.splice(index, 1)
    });
    broadcast(`${currentClient.name} has disconnected`)
    numberOfConnections();
  });

  socket.on("error", (err) => {
    console.log(err);
  });
  socket.on("data", (input) => {
    sendMessage(currentClient, input.toString().trim());
  });
});

server.on('close', () => {
  chatLog.write(`'Server shutdown ${date}\n`);
})

server.listen(3000, () => {
  console.log('server is listening on port 3000');
});
