import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, 'user', {
    expiresIn: "30d",
  });
};

export default generateToken;
