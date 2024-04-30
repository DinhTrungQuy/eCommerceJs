"user strict";

const jwt = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  // access token
  const accessToken = await jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });
  const refreshToken = await jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });
  // console.log(jwt.verify(accessToken, publicKey, { algorithms: ["RS256"] }));

  return { accessToken, refreshToken };
};

module.exports = { createTokenPair };
