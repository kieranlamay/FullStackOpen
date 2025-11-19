const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);
// run test with: npm run test -- tests/blog_api.test.js
describe("when there are initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  describe("fetching blogs", () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
      const response = await api.get("/api/blogs");

      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("unique identifier property of the blog posts is named id", async () => {
      const response = await api.get("/api/blogs");
      response.body.forEach((blog) => {
        assert.ok(blog.id);
        assert.strictEqual(blog._id, undefined);
      });
    });
  });

  describe("creating blogs", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "New Blog",
        author: "Author Three",
        url: "http://newblog.com",
        likes: 5,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert.ok(titles.includes("New Blog"));
    });

    test("that verifies that if the likes property is missing from the request, it will default to the value 0", async () => {
      const newBlog = {
        title: "New Blog",
        author: "Author Three",
        url: "http://newblog.com",
      };

      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });
  });

  describe("validation", () => {
    test("if the title or url properties are missing from the request data, respond with 400 bad request", async () => {
      const noTitleBlog = {
        author: "Author Three",
        url: "http://newblog.com",
        likes: 4,
      };

      await api.post("/api/blogs").send(noTitleBlog).expect(400);

      const noUrlBlog = {
        title: "New Blog",
        author: "Author Three",
        likes: 4,
      };

      await api.post("/api/blogs").send(noUrlBlog).expect(400);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogInDb();

      const titles = blogsAtEnd.map((b) => b.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
    });
  });

  describe("updating a blog", () => {
    test("succeeds in updating the likes of a blog", async () => {
      const blogsAtStart = await helper.blogInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedBlogData = {
        likes: blogToUpdate.likes + 1,
      };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
