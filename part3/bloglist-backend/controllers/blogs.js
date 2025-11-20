const Blog = require("../models/blog");
const blogsRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

  // never trust the payload token blindly
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
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

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    response.status(404).end(); // should i add a message later?
  } else {
    response.status(204).end();
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
