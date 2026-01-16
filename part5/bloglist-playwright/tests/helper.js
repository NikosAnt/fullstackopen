export const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('write blog title here').fill(title)
  await page.getByPlaceholder('write blog author here').fill(author)
  await page.getByPlaceholder('write blog url here').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('button', { name: 'cancel' }).click()
}

export const clickMultipleTimes = async (locator, times) => {
  for (let i = 0; i < times; i++) {
    await locator.click()
  }
}
