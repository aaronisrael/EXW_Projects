require(`dotenv`).load({silent: true});

const {
  PORT = 3000,
  URL = `http://192.168.0.240`
} = process.env;

const Server = require(`hapi`).Server;

const server = new Server();

server.connection({port: PORT, host: `192.168.0.240`});

const io = require(`socket.io`)(server.listener);

const users = [];
// let key = 0;
io.on(`connection`, socket => {
  users.push(socket.id);
  console.log(users);
  if (users.length === 2) {
    console.log(`2 users`);
    io.sockets.emit(`players`, users);
  }
  socket.on(`disconnect`, () => {
    console.log(`client disconnected`);
    const index = users.indexOf(socket.id);
    if (index > - 1) {
      users.splice(index, 1);
    }
  });
  socket.on(`playerOne`, movement => {
    io.sockets.emit(`playerOne`, movement);
  });
  socket.on(`playerTwo`, movement => {
    io.sockets.emit(`playerTwo`, movement);
  });
  socket.on(`ballPos`, ballPos => {
    io.sockets.emit(`ballPos`, ballPos);
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
