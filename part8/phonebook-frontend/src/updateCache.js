const uniqById = a => {
  let seen = new Set()
  return a.filter(item => {
    let k = item.id
    return seen.has(k) ? false : seen.add(k)
  })
}

const updateCache = (cache, query, addedPerson) => {
  cache.updateQuery(query, ({ allPersons }) => {
    return {
      allPersons: uniqById(allPersons.concat(addedPerson))
    }
  })
}

export default updateCache
