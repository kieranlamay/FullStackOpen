import { useState } from "react";

const Blog = ({ blog, updateBlog, user, handleRemoveBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const increaseLikes = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    updateBlog(updatedBlog);
  };

  const removeBlog = () => {
    if (
      window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) === false
    ) {
      return;
    }
    handleRemoveBlog(blog);
  };

  return (
    <div>
      <div style={blogStyle}>
        {blog.title} {blog.author}
        {/* <div style={hideWhenVisible}> */}
        <button style={hideWhenVisible} onClick={toggleVisibility}>
          View
        </button>
        {/* </div> */}
        <button style={showWhenVisible} onClick={toggleVisibility}>
          Hide
        </button>
        <div style={showWhenVisible}>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            {blog.likes} <button onClick={increaseLikes}>Like</button>
          </div>
          <div>{blog.user.name}</div>

          {user.name === blog.user.name && (
            <button onClick={removeBlog}>Remove</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Blog;
