async function feed(_, args, context) {
  return context.prisma.link.findMany();
}

module.exports = {
  feed,
};
