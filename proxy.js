const net = require("net");

const PORT = process.env.PORT || 1080;

const server = net.createServer((socket) => {
  console.log("Client connected:", socket.remoteAddress);

  socket.once("data", (handshake) => {
    if (handshake[0] !== 0x05) {
      console.log("Unsupported SOCKS version:", handshake[0]);
      socket.end();
      return;
    }

    socket.write(Buffer.from([0x05, 0x00]));
    console.log("Handshake response sent");

    socket.once("data", (request) => {
      const cmd = request[1];
      const addressType = request[3];

      let destAddr, destPort;

      if (addressType === 0x03) {
        const addrLen = request[4];
        destAddr = request.slice(5, 5 + addrLen).toString();
        destPort = request.readUInt16BE(5 + addrLen);
      } else if (addressType === 0x01) {
        destAddr = request.slice(4, 8).join(".");
        destPort = request.readUInt16BE(8);
      } else {
        console.log("Unsupported address type:", addressType);
        socket.end();
        return;
      }

      console.log(`Client wants to connect to ${destAddr}:${destPort}`);

      socket.write(
        Buffer.from([
          0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        ])
      );

      const remote = net.connect(destPort, destAddr, () => {
        console.log(`Connected to ${destAddr}:${destPort}`);
      });

      // Manual forwarding
      socket.on("data", (chunk) => {
        console.log("From client:", chunk.toString());
        remote.write(chunk);
      });

      remote.on("data", (chunk) => {
        console.log("From server:", chunk.toString());
        socket.write(chunk);
      });

      // Graceful shutdown
      socket.on("end", () => {
        console.log("Client disconnected");
        remote.end();
      });

      remote.on("end", () => {
        console.log("Remote closed");
        socket.end();
      });

      socket.on("error", (err) => {
        console.error("Socket error:", err.message);
        remote.end();
      });

      remote.on("error", (err) => {
        console.error("Remote error:", err.message);
        socket.end();
      });

      socket.on("close", () => {
        console.log("Client closed");
      });

      remote.on("close", () => {
        console.log("Remote closed");
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`SOCKS5 proxy listening on port ${PORT}`);
});
