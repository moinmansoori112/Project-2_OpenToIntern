const blogModel = require("../models/blogModels");
const authorModel = require("../models/authorModel");

// 2) create Blog controller
const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    if (blog) {
      let author = await authorModel.find({ _id: blog.authorId });
      if (author.length != 0) {
        let blogCreated = await blogModel.create(blog);

        if (blog.isPublished === true) {
          let mainBlog = await blogModel.findOneAndUpdate(
            { _id: blogCreated._id },
            { $set: { publishedAt: Date.now() } },
            { new: true }
          );

          return res.status(201).send({ publishedBlog: mainBlog });
        }
        return res.status(201).send({ unPublishedBlog: blogCreated });
      } else {
        return res.status(404).send({ ERROR: "Author does not exist" });
      }
    } else {
      return res.status(400).send({ ERROR: "BAD REQUEST" });
    }
  } catch (err) {
    return res.status(500).send({ ERROR: err.message });
  }
};

// 3) get Blog controller
const getSpecificAllBlogs = async function (req, res) {

  try {

    let array = []
    let authorId = req.query.authorId
    let tags = req.query.tags
    let category = req.query.category
    let subcategory = req.query.subcategory
    let blog = await blogModel.find({ $or: [{ authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }] })

    if (blog.length > 0) {

      for (let element of blog) {

        if (element.isDeleted === false && element.isPublished === true) {

          array.push(element)

        }

      } res.status(200).send({ status: true, data: array })
    } else {
      res.status(404).send({
        status: false,
        msg: "no such blog found"
      })
    }

  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: "failed", message: err.message })
  }

}


//4) Updating Blog controller
const updateBlog = async function (req, res) {
  const Id = req.params.blogId
  try {
    if (Id) {
      let data = await blogModel.findById(Id)
      if (data.isDeleted == false) {
        let value1 = req.body.bodyupdate
        let value2 = req.body.title
        const arr2 = req.body.subcategory
        const arr1 = req.body.tags
        data.tags = data.tags.concat(arr1)
        const result1 = data.tags.filter(b => b != null)
        console.log(data.tags)
        data.subcategory = data.subcategory.concat(arr2)
        const result2 = data.subcategory.filter(b => b != null)
        console.log(data.subcategory)
        let data2 = await blogModel.findOneAndUpdate({ _id: Id }, { title: value2, body: value1, tags: result1, subcategory: result2 }, { new: true })
        if (data.isPublished == false)
          data2 = await blogModel.findOneAndUpdate({ _id: Id }, { isPublished: true, publishedAt: Date.now() }, { new: true })
        res.status(200).send({ status: true, msg: data2 })
      }
      else
        res.status(404).send({ status: "false", msg: "data is already deleted" })

    }
    else
      res.status(404).send({ status: "false", msg: "id is not exist" })

  }
  catch (err) {
    res.status(500).send({ message: err.message })
  }
}

// 5)Delete blog by path params controller

let deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!blogId) { return res.status().send({ status: false, ERROR: "No Blogs are found With this Id" }) };
    if (blogId) {
      let deletedBlog = await blogModel.findOneAndUpdate(
        { _id: blogId },
        { $set: { isDeleted: true }, deletedAt: Date.now() },
        { new: true }
      );

      return res.status(201).send({ status: true, DeletedBlogsResult: "Deleted Blog" });
    } else
      return res.status(400).send({ ERROR: "BAD REQUEST" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// 6)Delete blog by using Query Params controller
let deletedByQueryParams = async function (req, res) {
  try {
    let data = req.query;
    if (!data) { return res.status().send({ status: false, ERROR: "No Blogs are found With this Id" }) };
    if (data) {
      let deletedBlogsFinal = await blogModel.updateMany(
        { $in: data },
        { $set: { isDeleted: true }, deletedAt: Date.now() }
      );
      return res.status(201).send({ status: true, msg: "Deleted Blog" });
    } else {
      return res.status(400).send({ ERROR: "BAD REQUEST" });
    }
  } catch (err) {
    return res.status(500).send({ ERROR: err.message });
  }
};

module.exports.createBlog = createBlog;
module.exports.updateBlog = updateBlog;
module.exports.getSpecificAllBlogs = getSpecificAllBlogs;
module.exports.deleteBlog = deleteBlog;
module.exports.deletedByQueryParams = deletedByQueryParams;
