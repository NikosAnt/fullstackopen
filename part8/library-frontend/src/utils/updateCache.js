const uniqById = a => {
  const seen = new Set()
  return a.filter(item => {
    const k = item.id
    return seen.has(k) ? false : seen.add(k)
  })
}

const updateCache = (cache, query, addedBook) => {
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqById(allBooks.concat(addedBook))
    }
  })
}

export default updateCache
