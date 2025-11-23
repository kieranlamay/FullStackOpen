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
        <BlogForm
          handleMessageChange={(message) => setMessage(message)}
          handleBlogsChange={(newBlog) =>
            setBlogs(
              blogs
                .concat({ ...newBlog, user })
                .sort((a, b) => b.likes - a.likes)
            )
          }
        />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          user={user}
          name={blog.user.name}
          blog={blog}
          updateBlog={(newBlog) =>
            setBlogs(
              blogs
                .map((blog) => (blog.id === newBlog.id ? newBlog : blog))
                .sort((a, b) => b.likes - a.likes)
            )
          }
          handleRemoveBlog={(targetBlog) =>
            setBlogs(blogs.filter((blog) => targetBlog.id !== blog.id))
          }
        />
      ))}
      <form action="submit" onSubmit={handleLogout}>
        <button>Logout</button>
      </form>
    </div>
  );
};

export default App;
