require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();

const typeDefs = gql`
  ${fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8")}
`;

const resolvers = {
  Query: {
    feed: async (_, args, context) => {
      return context.prisma.link.findMany();
    },
  },

  Mutation: {
    post: (_, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const userId = req && req.headers.authorization ? getUserId(req) : null;
    return {
      prisma,
      userId,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server ready at: ${url}`));
