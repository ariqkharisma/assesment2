import jwt from "jsonwebtoken";

const createAccessToken = (payload: any) => {
  return jwt.sign(payload, "JWT_SECRET", {
    expiresIn: "30d",
  });
};

export default createAccessToken;
