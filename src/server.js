const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    info: String!
  }
`;

const resolvers = {
  Query: {
    info: () => "HackerNews Clone",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server ready at: ${url}`));
