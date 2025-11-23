import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ handleBlogsChange, handleMessageChange }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({ title, author, url });
      handleBlogsChange(newBlog);
      setTitle("");
      setAuthor("");
      setUrl("");
      handleMessageChange(`a new blog ${title} added`);
      setTimeout(() => {
        handleMessageChange(null);
      }, 5000);
    } catch (error) {
      handleMessageChange(error.response.data.error);
      setTimeout(() => {
        handleMessageChange(null);
      }, 5000);
    }
  };

  return (
    <div>
      {" "}
      <h2>create a new blog</h2>
      <form action="submit" onSubmit={handleCreate}>
        <div>
          <label>
            title:{" "}
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label htmlFor="">
            author:{" "}
            <input
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </label>
        </div>

        <div>
          <label htmlFor="">
            url:{" "}
            <input
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
