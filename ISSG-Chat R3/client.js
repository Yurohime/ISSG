const io = require("socket.io-client");
const readline = require("readline");
const crypto = require("crypto");

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

let targetUsername = "";
let username = "";
const users = new Map();
let privateKey = null;  // Store the client's private key
let publicKey = null;  // Store the client's public key

// Generate a public/private key pair for the client (you should use actual key pairs in production)
function generateKeyPair() {
  const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
  return { pubKey, privKey };
}

const { pubKey, privKey } = generateKeyPair();
publicKey = pubKey;
privateKey = privKey;

socket.on("connect", () => {
  console.log("Connected to the server");

  rl.question("Enter your username: ", (input) => {
    username = input;
    console.log(`Welcome, ${username} to the chat`);

    // Send public key to the server when registering
    socket.emit("registerPublicKey", {
      username,
      publicKey,
    });
    rl.prompt();

    rl.on("line", (message) => {
      if (message.trim()) {
        if ((match = message.match(/^!secret (\w+)$/))) {
          targetUsername = match[1];
          console.log(`Now secretly chatting with ${targetUsername}`);
        } else if (message.match(/^!exit$/)) {
          console.log(`No more secretly chatting with ${targetUsername}`);
          targetUsername = "";
        } else {
          if (targetUsername) {
            // Encrypt message before sending to the target
            const encryptedMessage = encryptMessage(message, targetUsername);
            socket.emit("message", { username, message: encryptedMessage, targetUsername });
          } else {
            socket.emit("message", { username, message });
          }
        }
      }
      rl.prompt();
    });
  });
});

socket.on("init", (keys) => {
  keys.forEach(([user, key]) => users.set(user, key));
  console.log(`\nThere are currently ${users.size} users in the chat`);
  rl.prompt();
});

socket.on("newUser", (data) => {
  const { username, publicKey } = data;
  users.set(username, publicKey);
  console.log(`${username} joined the chat`);
  rl.prompt();
});

socket.on("message", (data) => {
  const { username: senderUsername, message: senderMessage, targetUsername: target } = data;

  if (senderUsername !== username) {
    if (targetUsername && targetUsername === senderUsername) {
      // Decrypt secret message for the target
      const decryptedMessage = decryptMessage(senderMessage);
      console.log(`${senderUsername} (secret): ${decryptedMessage}`);
    } else {
      console.log(`${senderUsername}: ${senderMessage}`);
    }
    rl.prompt();
  }
});

socket.on("disconnect", () => {
  console.log("Server disconnected, Exiting...");
  rl.close();
  process.exit(0);
});

rl.on("SIGINT", () => {
  console.log("\nExiting...");
  socket.disconnect();
  rl.close();
  process.exit(0);
});

// Encrypt the message using the target's public key
function encryptMessage(message, targetUsername) {
  const targetPublicKey = users.get(targetUsername);
  if (!targetPublicKey) {
    console.log("Error: Target user not found!");
    return message;
  }
  
  // Use RSA encryption (public key for encryption)
  const encryptedMessage = crypto.publicEncrypt(
    targetPublicKey,
    Buffer.from(message)
  );
  return encryptedMessage.toString("base64");
}

// Decrypt the message using the client's private key
function decryptMessage(encryptedMessage) {
  if (!privateKey) {
    console.log("Error: Private key not set!");
    return encryptedMessage;
  }

  // Decrypt the message using RSA private key
  const decryptedMessage = crypto.privateDecrypt(
    privateKey,
    Buffer.from(encryptedMessage, "base64")
  );
  return decryptedMessage.toString();
}
