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
const Subscription = require("./resolvers/Subscription");

// Subscription
const { PubSub } = require("apollo-server");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const typeDefs = gql`
  ${fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8")}
`;

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server ready at: ${url}`));
