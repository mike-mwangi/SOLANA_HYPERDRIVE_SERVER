import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // add user id field to request body object
    req.UserId = verified.id;
    req.UserRole = verified.role;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};
