
// const log = true;

require(`dotenv`).load({silent: true});

const {
  PORT = 3000,
  URL = `http://localhost`
} = process.env;

const Server = require(`hapi`).Server;

const server = new Server();

server.connection({port: PORT});

const io = require(`socket.io`)(server.listener);
io.on(`connection`, socket => {
  console.log(`connection`);
  socket.on(`message`, message => {
    console.log(`received message: ${message}`);
    io.sockets.emit(`message`, message);
  });
});

server.start(err => {

  if (err) return console.error(err);

  console.log(``);
  console.log(`Server running at: ${URL}:${PORT}`);

});

server.register(require(`inert`), err => {
  if (err) {
    throw err;
  }

  server.route({
    method: `GET`,
    path: `/{param*}`,
    handler: {
      directory: {
        path: `./server/public/`
      }
    }
  });
});
