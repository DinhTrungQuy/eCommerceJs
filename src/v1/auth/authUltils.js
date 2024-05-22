"user strict";

const jwt = require("jsonwebtoken");
const HEADER = require("../consts/header");
const {
  UnauthorizedResponse,
  NotFoundResponse,
} = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

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

const authentication = async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedResponse(`Invalid client id`);
  }
  const keyStore = await KeyTokenService.getKeyTokenByUserId(userId);
  if (!keyStore) {
    throw new NotFoundResponse(`Invalid client id`);
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.split(" ")[1];
  if (!accessToken) {
    throw new UnauthorizedResponse(`Invalid access token`);
  }
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if (refreshToken) {
    const payload = jwt.verify(refreshToken, keyStore.publicKey, {
      algorithms: ["RS256"],
    });
    if (userId != payload.userId) {
      throw new UnauthorizedResponse(`Invalid access token`);
    }
    req.keyStore = keyStore;
    req.userId = userId;
    req.refreshToken = refreshToken;
    return next();
  }
  const payload = jwt.verify(accessToken, keyStore.publicKey, {
    algorithms: ["RS256"],
  });
  if (userId != payload.userId) {
    throw new UnauthorizedResponse(`Invalid access token`);
  }
  req.keyStore = keyStore;
  req.userId = userId;

  return next();
};

const verifyJWT = (token, keySecret) => {
  return jwt.verify(token, keySecret, { algorithms: ["RS256"] });
};

module.exports = { createTokenPair, authentication, verifyJWT };
