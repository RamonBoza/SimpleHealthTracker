import { createServer, Server } from "node:net";
export const messages: string[] = [];
let server: Server;
export async function startMail() {
  server = createServer((socket) => {
    socket.setEncoding("utf8");
    socket.write("220 localhost test SMTP\r\n");
    let buffer = "";
    let receiving = false;
    let message = "";
    socket.on("data", (chunk) => {
      buffer += chunk;
      while (buffer.includes("\r\n")) {
        const split = buffer.indexOf("\r\n");
        const line = buffer.slice(0, split);
        buffer = buffer.slice(split + 2);
        if (receiving) {
          if (line === ".") {
            messages.push(message);
            receiving = false;
            message = "";
            socket.write("250 Accepted\r\n");
          } else message += line + "\n";
          continue;
        }
        if (/^EHLO|^HELO/.test(line)) socket.write("250 localhost\r\n");
        else if (line === "DATA") {
          receiving = true;
          socket.write("354 Send message\r\n");
        } else if (line === "QUIT") {
          socket.end("221 Bye\r\n");
        } else socket.write("250 OK\r\n");
      }
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(2525, "127.0.0.1", resolve);
  });
}
export async function stopMail() {
  await new Promise<void>((resolve, reject) =>
    server.close((e) => (e ? reject(e) : resolve())),
  );
}
