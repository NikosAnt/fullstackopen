import _, { transform } from 'lodash'

const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const mostBlogs = blogs => {
  const authorBlogCount = transform(
    blogs,
    (acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1
      return acc
    },
    {}
  )

  const maxBlogsAuthor = _(authorBlogCount)
    .keys()
    .reduce((a, b) => (authorBlogCount[a] > authorBlogCount[b] ? a : b))
  return {
    author: maxBlogsAuthor,
    blogs: authorBlogCount[maxBlogsAuthor]
  }
}

const mostLikes = blogs => {
  const authorLikesCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const maxLikesAuthor = Object.keys(authorLikesCount).reduce((a, b) =>
    authorLikesCount[a] > authorLikesCount[b] ? a : b
  )
  return {
    author: maxLikesAuthor,
    likes: authorLikesCount[maxLikesAuthor]
  }
}

export { dummy, totalLikes, mostBlogs, mostLikes }
