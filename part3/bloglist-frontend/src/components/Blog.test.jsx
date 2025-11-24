import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import { test } from "vitest";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("by default, renders title and author but not url or likes", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testurl.com",
    likes: 5,
    user: {
      name: "Test User",
    },
  };

  render(
    <Blog
      blog={blog}
      user={{ name: "Test User" }}
      updateBlog={() => {}}
      handleRemoveBlog={() => {}}
    />
  );

  const element = screen.getByText("Test Blog Test Author");
  expect(element).toBeDefined();

  const urlElement = screen.getByText("http://testurl.com");
  expect(urlElement).not.toBeVisible();

  const likesElement = screen.getByText("5");
  expect(likesElement).not.toBeVisible();
});

test("after clicking the view button, url and likes are displayed", async () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testurl.com",
    likes: 5,
    user: {
      name: "Test User",
    },
  };

  render(
    <Blog
      blog={blog}
      user={{ name: "Test User" }}
      updateBlog={() => {}}
      handleRemoveBlog={() => {}}
    />
  );
  const user = userEvent.setup();
  const button = screen.getByText("View");
  await user.click(button);

  const urlElement = screen.getByText("http://testurl.com");
  expect(urlElement).toBeVisible();

  const likesElement = screen.getByText("5");
  expect(likesElement).toBeVisible();
});

test("if the like button is clicked twice, the event handler is called twice", async () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testurl.com",
    likes: 5,
    user: {
      name: "Test User",
    },
  };

  const mockUpdateBlog = vi.fn();
  render(
    <Blog
      blog={blog}
      user={{ name: "Test User" }}
      updateBlog={mockUpdateBlog}
      handleRemoveBlog={() => {}}
    />
  );
  const user = userEvent.setup();
  const viewButton = screen.getByText("View");
  await user.click(viewButton);
  const likeButton = screen.getByText("Like");
  await user.click(likeButton);
  await user.click(likeButton);
  expect(mockUpdateBlog.mock.calls).toHaveLength(2);
});

test("form calls event handler with correct details when a new blog is created", async () => {
  const mockHandleBlogsChange = vi.fn();
  render(<BlogForm handleBlogsChange={mockHandleBlogsChange} />);

  const user = userEvent.setup();

  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const createButton = screen.getByText("Create");

  await user.type(titleInput, "New Blog Title");
  await user.type(authorInput, "New Blog Author");
  await user.type(urlInput, "http://newblogurl.com");
  await user.click(createButton);

  expect(mockHandleBlogsChange.mock.calls).toHaveLength(1);
  expect(mockHandleBlogsChange.mock.calls[0][0]).toEqual({
    title: "New Blog Title",
    author: "New Blog Author",
    url: "http://newblogurl.com",
  });
});
