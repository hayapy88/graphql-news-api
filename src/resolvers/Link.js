async function postedBy(parent, args, context) {
  const link = await context.prisma.link.findUnique({
    where: { id: parent.id },
    include: { postedBy: true },
  });
  return link ? link.postedBy : null;
}

module.exports = {
  postedBy,
};
