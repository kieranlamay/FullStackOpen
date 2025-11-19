const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total_likes, blog) => total_likes + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((acc, curr) => (curr.likes > acc.likes ? curr : acc));
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
