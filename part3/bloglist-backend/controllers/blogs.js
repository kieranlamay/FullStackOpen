const Blog = require("../models/blog");
const blogsRouter = require("express").Router();
// const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = new Blog(request.body);

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  try {
    blog.user = user._id;
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "blog not found" }); // should i add a message later?
  }
  // decoded token id is the user id of the logged in user
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: "invalid user" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    response.status(404).end();
  } else {
    blog.likes = request.body.likes;
    const updatedBlog = await blog.save();
    response.status(200).json(updatedBlog);
  }
});

module.exports = blogsRouter;
