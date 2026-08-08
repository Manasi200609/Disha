const errorMiddleware = (err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server"
  });
};

export default errorMiddleware;