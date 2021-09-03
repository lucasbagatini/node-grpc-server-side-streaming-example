const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const MainDefinition = grpc.loadPackageDefinition(
  protoLoader.loadSync(path.resolve(__dirname, "./protos/gaming/main.proto"))
);

const serverAddress = "localhost:50051";

const gameClient = new MainDefinition.GameService(
  serverAddress,
  grpc.credentials.createInsecure()
);

const gameStream = gameClient.list({});
gameStream.on("data", console.log);

gameClient.find({ id: 1 }, (err, game) => {
  console.log(game);
});
