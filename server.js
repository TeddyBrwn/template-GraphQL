const express = require("express");
const http = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require("graphql-ws/lib/use/ws");
const { WebSocketServer } = require("ws");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const bodyParser = require("body-parser");

require("dotenv").config();

const startServer = async () => {
  // Kết nối MongoDB
  await mongoose.connect(process.env.MONGO_URI);

  // Tạo schema GraphQL
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Tạo server HTTP
  const app = express();
  const httpServer = http.createServer(app);

  // Tạo WebSocketServer cho Subscription
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Sử dụng graphql-ws với WebSocketServer
  useServer({ schema }, wsServer);

  // Tạo Apollo Server
  const server = new ApolloServer({
    schema,
  });
  await server.start();

  // Middleware xử lý JSON
  app.use(bodyParser.json());
  app.use("/graphql", expressMiddleware(server));

  // Khởi động HTTP server
  httpServer.listen(4000, () => {
    console.log("🟢 Server running at http://localhost:4000/graphql 🚀");
  });
};

// Gọi hàm khởi động server
startServer().catch((error) => {
  console.error("🔴 Error starting server:", error);
});
