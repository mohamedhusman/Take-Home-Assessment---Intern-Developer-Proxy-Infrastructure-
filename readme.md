🧦 SOCKS5 Proxy Server (Node.js)
A lightweight SOCKS5 proxy server built in Node.js using raw TCP sockets. This project demonstrates manual stream forwarding, domain resolution, and protocol-level handling of SOCKS5 connections. Authentication is not implemented in this version, but the protocol flow is fully understood and explained in the demo video.

🚀 Features
SOCKS5 handshake and connection request parsing (RFC 1928)

Manual TCP stream forwarding for HTTP and HTTPS

Graceful socket shutdown and error handling

Logs every connection and data flow for debugging

Supports both IPv4 and domain-based destination addresses

🧪 Testing
curl --socks5 localhost:1080 http://httpbin.org/get
curl --socks5 localhost:1080 https://httpbin.org/get

📦 installation
git clone https://github.com/mohamedhusman/Take-Home-Assessment---Intern-Developer-Proxy-Infrastructure-.git

cd Take-Home-Assessment---Intern-Developer-Proxy-Infrastructure-

npm install

npm start

🛠️ Implementation Highlights
Uses net.createServer() for raw TCP handling

Parses SOCKS5 handshake and connection request manually

Replaces pipe() with explicit on('data') forwarding for full control

Logs every byte for visibility and debugging

Handles edge cases like premature socket closure and stream flushing

📚 Learning Journey
This project was built as part of an internship assignment focused on proxy infrastructure. It involved:

Byte-level protocol parsing

TCP stream debugging

Real-world testing with curl and Firefox

Documenting client-side limitations

Reflecting on protocol behavior and tooling gaps
