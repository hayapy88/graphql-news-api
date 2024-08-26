const jwt = require("jsonwebtoken");

// This JWT secret key is used to sign and verify JSON Web Tokens
const JWT_SECRET = process.env.JWT_SECRET;

function getTokenPayload(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Fetch User ID
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer", "").trim();
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error("No authorization");
}

module.exports = {
  JWT_SECRET,
  getUserId,
};
