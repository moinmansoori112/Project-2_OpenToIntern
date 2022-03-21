const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModels");

const autherAuthentication = function (req, res, next) {
  // compared the logged in user's Id and the Id in request
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res.status(400).send({
        status: false,
        ERROR: "token must be present in the request header",
      });
    let decodedToken = jwt.verify(token, "blogSites-phase2");

    if (!decodedToken)
      return res.status(400).send({ status: false, ERROR: "token is not valid" });
    let userLoggedIn = decodedToken.authId;
    console.log(userLoggedIn)
    let authorID = req.body.authorId;
    let authorID2 = req.query.authorId;
  
    if (!authorID) {
      if (authorID2 != userLoggedIn)
        return res.status(400).send({
          status: false,
          ERROR: "User logged is not allowed to modify the requested users data",
        });
    }
    if (!authorID2) {
      if (authorID != userLoggedIn)
        return res.status(400).send({
          status: false,
          ERROR: "User logged is not allowed to modify the requested users data",
        });
    }
   
    next();
  } catch (err) {
   return res.status(500).send({ ERROR: err.message });
  }
};
const authorAuthorization = async function (req, res, next) {
  // Get the Id from header
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res.status(404).send({
        status: false,
        Alert: "token must be present in the request header",
      });
    let decodedToken = jwt.verify(token, "blogSites-phase2");

    if (!decodedToken)
      return res.status(403).send({ status: false, ERROR: "token is not valid" });
    let userLoggedIn = decodedToken.authId;

    let blogId = req.params.blogId;
    let blogId2 = req.query.blogId;
    // validate the token
    if (!blogId2) {
      let x = await blogModel.findById(blogId);

      let autherID = x.authorId;

      if (autherID != userLoggedIn)
        return res.status(401).send({
          status: false,
          ERROR: "User logged is not allowed to modify the requested users data",
        });
    }
    if (!blogId) {
      let y = await blogModel.findById(blogId2);

      let autherID2 = y.authorId;

      if (autherID2 != userLoggedIn)
        return res.status(401).send({
          status: false,
          ERROR: "User logged is not allowed to modify the requested users data",
        });
    }

    next();
  } catch (err) {
   return res.status(500).send({ ERROR: err.message });
  }
};

module.exports.autherAuthentication = autherAuthentication;
module.exports.authorAuthorization = authorAuthorization;