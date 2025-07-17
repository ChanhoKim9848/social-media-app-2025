// protect route function
export const protectRoute = async (req, res, next) => {
  // if not logged in, handled by clerk
  if (!req.auth().isAuthenticated) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }
  next();
};
