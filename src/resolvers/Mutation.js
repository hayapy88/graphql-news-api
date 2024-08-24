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

async function login(parent, args, context) {
  try {
    // Find the user by Email
    const user = await context.prisma.user.findUnique({
      where: { email: args.email },
    });

    // Check if user exists
    if (!user) {
      throw new Error("No user found with this email.");
    }

    // Compare the provided password with the stored hashed password
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
      throw new Error("Password is invalid.");
    }

    // Set a payload
    const payload = { userId: user.id };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    return {
      token,
      user,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error(
      "An error occurred while logging in. Please try again later."
    );
  }
}
