require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");

// Subscription
// Publisher / Subscriber
const { PubSub } = require("apollo-server");
const pubsub = new pubsub();

const prisma = new PrismaClient();

const typeDefs = gql`
  ${fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8")}
`;

const resolvers = {
  Query,
  Mutation,
  Link,
  User,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const userId = req && req.headers.authorization ? getUserId(req) : null;
    return {
      prisma,
      pubsub,
      userId,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server ready at: ${url}`));
