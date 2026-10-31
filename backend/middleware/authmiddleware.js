const { getAuth } = require("../firebaseAdmin");

async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please log in first",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await getAuth().verifyIdToken(token);

    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid login",
    });
  }
}

function verifyAdmin(req, res, next) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (
    !adminEmail ||
    !req.user?.email ||
    req.user.email.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
}

module.exports = { verifyFirebaseToken, verifyAdmin };