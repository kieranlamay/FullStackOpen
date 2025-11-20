const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);
let authToken;
// run test with: npm run test -- tests/blog_api.test.js
describe("when the database has initial data", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    const password = "sekret";

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();

    // log the user in and store token for use in tests
    const loginResponse = await api
      .post("/api/login")
      .send({ username: "root", password })
      .expect(200);
    authToken = loginResponse.body.token;

    const blogsWithUser = helper.initialBlogs.map((b) => ({
      ...b,
      user: user._id,
    }));

    const savedBlogs = await Blog.insertMany(blogsWithUser);
    user.blogs = savedBlogs.map((b) => b._id);
    await user.save();
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
        .set("Authorization", `Bearer ${authToken}`)
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
        .set("Authorization", `Bearer ${authToken}`)
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

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(noTitleBlog)
        .expect(400);

      const noUrlBlog = {
        title: "New Blog",
        author: "Author Three",
        likes: 4,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(noUrlBlog)
        .expect(400);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

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

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ro",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes("is shorter than the minimum allowed length")
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "validusername",
      name: "Valid Name",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "password length must be at least 3 characters long"
      )
    );

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode if password is missing", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "validusername",
      name: "Valid Name",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("password must be given"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode if username is missing", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      name: "Valid Name",
      password: "validpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("User validation failed"));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("user blogs are populated correctly", async () => {
    const user = (await helper.usersInDb())[0];
    const newBlog = {
      title: "User's Blog",
      author: "User Author",
      url: "http://userblog.com",
      likes: 5,
      userId: user.id,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const updatedUser = await User.findById(user.id).populate("blogs");
    assert(updatedUser.blogs.some((blog) => blog.id === response.body.id));
  });

  test("adding a blog fails with proper status code if token is not provided", async () => {
    const newBlog = {
      title: "New Blog Without Token",
      author: "Author",
      url: "http://newblogwithouttoken.com",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
