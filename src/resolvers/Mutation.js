const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// This JWT secret key is used to sign and verify JSON Web Tokens
const JWT_SECRET = process.env.JWT_SECRET;

async function signUp(parent, args, context) {
  try {
    // Set password
    const password = await bcrypt.hash(args.password, 10);

    // Create a user
    const user = await context.prisma.user.create({
      data: {
        ...args,
        password,
      },
    });

    // Set a payload
    const payload = { userId: user.id };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    return {
      token,
      user,
    };
  } catch (error) {
    console.error("Error signing up user:", error);
    throw new Error(
      "An error occurred while signing up. Please try again later."
    );
  }
}
