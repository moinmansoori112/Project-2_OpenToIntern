const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogsController")
const middleWare = require("../middlewares/Auth.js")

//API's-creating Author
router.post("/authors", authorController.createAuthor)

router.post("/login", authorController.authorLogin);

//API's Blog
router.post("/blogs", middleWare.autherAuthentication, blogController.createBlog);

router.get("/blogs", middleWare.autherAuthentication, blogController.getSpecificAllBlogs);

router.put("/blogs/:blogId", middleWare.authorAuthorization, blogController.updateBlog);

router.delete("/blogs/:blogId", middleWare.authorAuthorization, blogController.deleteBlog);

router.delete("/blogs", middleWare.authorAuthorization, blogController.deletedByQueryParams);


module.exports = router;