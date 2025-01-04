const express = require("express");
const http = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require("graphql-ws/lib/use/ws");
const { WebSocketServer } = require("ws");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/schema");
const resolversQuery = require("./graphql/resolversQuery");
const resolversMutation = require("./graphql/resolversMutation");
const resolversSubsciption = require("./graphql/resolversSubsciption");
const bodyParser = require("body-parser");

require("dotenv").config();

const startServer = async () => {
  // Kết nối MongoDB
  await mongoose.connect(process.env.MONGO_URI);

  // Tạo schema GraphQL
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: {
      Query: { ...resolversQuery.Query }, // Query
      Mutation: { ...resolversMutation.Mutation }, // Mutation
      Subscription: { ...resolversSubsciption.Subscription }, // Subscription
    },
  });

  // Tạo server HTTP
  const app = express();
  const httpServer = http.createServer(app);

  // Tạo WebSocketServer cho Subscription
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/template-graphql",
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
    console.log(
      "🟢 Server running at http://localhost:4000/template-graphql 🚀"
    );
  });
};

// Gọi hàm khởi động server
startServer().catch((error) => {
  console.error("🔴 Error starting server:", error);
});
