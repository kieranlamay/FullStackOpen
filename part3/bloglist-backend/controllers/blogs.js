const Blog = require("../models/blog");
const blogsRouter = require("express").Router();

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  try {
    const savedBlog = await blog.save();
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
