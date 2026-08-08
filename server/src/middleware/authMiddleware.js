const authMiddleware = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  req.userId = userId;

  next();
};

export default authMiddleware;