const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "First Blog",
    author: "Author One",
    url: "http://firstblog.com",
    likes: 10,
  },
  {
    title: "Second Blog",
    author: "Author Two",
    url: "http://secondblog.com",
    likes: 20,
  },
];

// const nonExistingId = async () => {
//   const note = new Note({ content: "willremovethissoon" });
//   await note.save();
//   await note.deleteOne();

//   return note._id.toString();
// };

const blogInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogInDb,
};
