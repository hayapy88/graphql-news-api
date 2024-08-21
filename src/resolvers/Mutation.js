const bcrypt = require("bcryptjs");

async function signUp(parent, args, context) {
  // Set password
  const password = await bcrypt.hash(args.password, 10);

  // Create a user
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });
}
