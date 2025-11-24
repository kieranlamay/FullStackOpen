import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) {
      blogService
        .getAll()
        .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
    }
  }, [user]);

  useEffect(() => {
    const userJSON = window.localStorage.getItem("loggedBlogUser");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: username,
        password: password,
      });
      blogService.setToken(user.token);
      setUser(user);
      setPassword("");
      setUsername("");
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
    } catch (error) {
      setMessage(error.response.data.error);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogUser");
    blogService.setToken(null);
    setUser(null);
  };

  const handleCreateBlog = async (blogData) => {
    try {
      const newBlog = await blogService.create(blogData);
      setBlogs(
        blogs.concat({ ...newBlog, user }).sort((a, b) => b.likes - a.likes)
      );
      setMessage(`a new blog ${newBlog.title} added`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      setMessage(error?.response?.data?.error || error?.message);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleUpdateBlog = async (blogToUpdate) => {
    try {
      const updated = await blogService.updateLikes(blogToUpdate);
      setBlogs(
        blogs
          .map((b) => (b.id === updated.id ? updated : b))
          .sort((a, b) => b.likes - a.likes)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRemoveBlog = async (blogToRemove) => {
    try {
      await blogService.remove(blogToRemove);
      setBlogs(blogs.filter((b) => b.id !== blogToRemove.id));
    } catch (error) {
      console.log(error.message);
    }
  };

  if (user === null) {
    return (
      <Togglable buttonLabel="Login">
        <LoginForm
          handleLogin={handleLogin}
          message={message}
          handlePasswordChange={(event) => setPassword(event.target.value)}
          handleUsernameChange={(event) => setUsername(event.target.value)}
          username={username}
          password={password}
        />
      </Togglable>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>{message}</div>
      <div>{user.name} logged in</div>
      <Togglable buttonLabel="create new blog">
        <BlogForm handleBlogsChange={handleCreateBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          user={user}
          name={blog.user.name}
          blog={blog}
          updateBlog={handleUpdateBlog}
          handleRemoveBlog={handleRemoveBlog}
        />
      ))}
      <form action="submit" onSubmit={handleLogout}>
        <button>Logout</button>
      </form>
    </div>
  );
};

export default App;
