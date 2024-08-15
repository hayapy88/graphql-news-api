const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    description: "Hello GraphQL",
    url: "https://graphql.org/",
  },
];

const resolvers = {
  Query: {
    feed: () => links,
  },

  Mutation: {
    post: (_, args) => {
      let idCount = links.length;

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };

      links.push(link);
      return link;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server ready at: ${url}`));
