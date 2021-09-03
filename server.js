const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const games = require("./gaming.json");

const MainDefinition = grpc.loadPackageDefinition(
  protoLoader.loadSync(path.resolve(__dirname, "./protos/gaming/main.proto"))
);

function ListGames(call) {
  for (const game of games) {
    call.write(game);
  }
  call.end();
}

function Find(id, list) {
  return list.find(item => item.id === id);
}

function FindGame({ request: { id } }, callback) {
  const game = Find(id, games);
  if (!game) return callback(new Error("Not found"), null);
  return callback(null, { game });
}

const server = new grpc.Server();

server.addService(MainDefinition.GameService.service, {
  List: ListGames,
  Find: FindGame,
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);
