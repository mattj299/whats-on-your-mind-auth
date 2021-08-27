import jwt from "jsonwebtoken";

// checks if user is authenticated. if authenticated then req.userId = id of token, else doesn't exist
const auth = async (req, res, next) => {
  try {
    // need [1] since if you remember we set token to be `Bearer ${token}` in client/api so it's in the second array item in the split
    const token = req.headers.authorization.split(" ")[1];

    // if token is < 500 then it's our custom token and if > 500 then it's googleOauth token (in obj here it's sub for decodedData but for normal obj it's googleId)
    // decode token and set req.userId to user id
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    // call next function since this is middleware next function needs to be called to run the next part
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
