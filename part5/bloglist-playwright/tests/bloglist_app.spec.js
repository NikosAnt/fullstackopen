import { test, expect, beforeEach, describe } from '@playwright/test'

import { loginWith, createBlog, clickMultipleTimes } from './helper'

describe('Blog app', () => {
  beforeEach(async ({ page, request }, testInfo) => {
    testInfo.name = `name-${testInfo.project.name}`
    testInfo.name2 = `name2-${testInfo.project.name}`
    testInfo.username = `username-${testInfo.project.name}`
    testInfo.username2 = `username2-${testInfo.project.name}`
    testInfo.password = `password-${testInfo.project.name}`
    testInfo.password2 = `password2-${testInfo.project.name}`
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: testInfo.name,
        username: testInfo.username,
        password: testInfo.password
      }
    })
    await request.post('/api/users', {
      data: {
        name: testInfo.name2,
        username: testInfo.username2,
        password: testInfo.password2
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: 'Login' })
    ).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByRole('textBox', { name: 'username' })).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('textBox', { name: 'password' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }, testInfo) => {
      await loginWith(page, testInfo.username, testInfo.password)
      await expect(page.getByText(`${testInfo.name} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }, testInfo) => {
      await loginWith(page, testInfo.username, 'wrong')
      await expect(
        page.getByRole('heading', { level: 2, name: 'Login' })
      ).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }, testInfo) => {
      await loginWith(page, testInfo.username, testInfo.password)
    })

    test('a new blog can be created', async ({ page }, testInfo) => {
      await createBlog(
        page,
        `${testInfo.name} title`,
        `${testInfo.name} author`,
        `${testInfo.name} url`
      )
      await expect(
        page.getByText(`${testInfo.name} title ${testInfo.name} author`)
      ).toBeVisible()
    })

    describe('When a new blog is created', () => {
      beforeEach(async ({ page }, testInfo) => {
        await createBlog(
          page,
          `${testInfo.name} title`,
          `${testInfo.name} author`,
          `${testInfo.name} url`
        )
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1like')).toBeVisible()
      })

      test('user who added, can delete the blog', async ({
        page
      }, testInfo) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.once('dialog', async dialog => {
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'delete' }).click()
        await expect(
          page.getByText(`${testInfo.name} title ${testInfo.name} author`)
        ).toHaveCount(0)
      })

      describe('User logs out and different user logs in', () => {
        beforeEach(async ({ page }, testInfo) => {
          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, testInfo.username2, testInfo.username2)
        })

        test('non-creator user cannot see the delete button', async ({
          page
        }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await expect(
            page.getByRole('button', { name: 'delete' })
          ).toBeHidden()
        })

        describe('More blogs are added and liked', () => {
          beforeEach(async ({ page }, testInfo) => {
            await createBlog(
              page,
              `${testInfo.name} title2`,
              `${testInfo.name} author2`,
              `${testInfo.name} url2`
            )
            await createBlog(
              page,
              `${testInfo.name} title3`,
              `${testInfo.name} author3`,
              `${testInfo.name} url3`
            )
            const blogs = page.locator('.blog')
            const blogCount = await blogs.count()
            for (let index = 0; index < blogCount; index += 1) {
              const blog = blogs.nth(index)
              await blog.locator('[data-testid^="view-btn-"]').click()
              const likeButton = blog.getByRole('button', { name: 'like' })
              const times = Math.floor(Math.random() * 5) + 1 // 1 to 5 likes
              await clickMultipleTimes(likeButton, times)
            }
          })
          test('Blogs are arranged according to the likes descending', async ({
            page
          }) => {
            const blogs = page.locator('.blog')
            const blogCount = await blogs.count()
            for (let index = 0; index < blogCount; index += 1) {
              const blog = blogs.nth(index)
              await blog.locator('[data-testid^="view-btn-"]').click()
            }
            const likesElements = await page
              .locator('[data-testid^="likes-count-"]')
              .all()
            const likeCounts = []
            for (const element of likesElements) {
              const text = await element.textContent()
              likeCounts.push(Number(text.replace(/D/g, '')))
            }

            const sorted = [...likeCounts].sort((a, b) => b - a)
            expect(likeCounts).toEqual(sorted)
          })
        })
      })
    })
  })
})
