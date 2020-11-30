const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./db/schema");
const { resolvers } = require("./db/resolvers");
const { connectDb } = require("./config/db");
require("dotenv").config({ path: ".env" });
const jwt = require("jsonwebtoken");

connectDb();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const usuario = jwt.verify(token, process.env.SECRET);
        return { usuario };
      } catch (error) {
        console.error(error);
      }
    }
  },
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log("====================================");
  console.log(`Servidor en ${url}`);
  console.log("====================================");
});
