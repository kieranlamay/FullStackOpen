const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const listWithMultipleBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has multiple blogs, equals the sum of likes", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 12);
  });
});

describe("favorite blog", () => {
  const listWithMultipleBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f9",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    },
  ];
  test("returns the blog with the most likes", () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs);
    assert.deepStrictEqual(result, {
      _id: "5a422aa71b54a676234d17f9",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0,
    });
  });

  test("returns one of the blogs when multiple have the same highest likes", () => {
    const blogsWithTie = [
      ...listWithMultipleBlogs,
      {
        _id: "5a422aa71b54a676234d17fa",
        title: "Another blog",
        author: "Jane Doe",
        url: "https://anotherblog.com/",
        likes: 7,
        __v: 0,
      },
    ];
    const result = listHelper.favoriteBlog(blogsWithTie);
    // assert.ok(
    //   result.likes === 7 &&
    //   (result._id === "5a422aa71b54a676234d17f9" || result._id === "5a422aa71b54a676234d17fa")
    // );
    assert.deepStrictEqual(
      result,
      {
        _id: "5a422aa71b54a676234d17f9",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0,
      } || {
        _id: "5a422aa71b54a676234d17fa",
        title: "Another blog",
        author: "Jane Doe",
        url: "https://anotherblog.com/",
        likes: 7,
        __v: 0,
      }
    );
  });
});
