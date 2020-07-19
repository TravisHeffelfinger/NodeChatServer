const fs = require("fs");
const net = require("net");

process.stdin.on("readable", () => {
  let input;
  while((input = process.stdin.read()) !== null) {
    if(input) client.write(input.toString().trim());
  }
});

const client = net.createConnection({ port: 3000 }, () => {
  console.log("connected");
});

client.on("error", (err) => {
  console.log(err);
});

client.on("data", (response) => {
  console.log("# " + response.toString().trim());
});

client.on("end", () => console.log("ending session"));
