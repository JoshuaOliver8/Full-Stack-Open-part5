import React from 'react'
import { render, screen } from  '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('Blog form calls the received event handler and creates a blog with the right details', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    const creator = {
        name: 'root'
    }

    render(<BlogForm createBlog={createBlog} user={creator}/>)

    const titleInput = screen.getByTestId('title')
    const authorInput = screen.getByTestId('author')
    const urlInput = screen.getByTestId('url')
    const likesInput = screen.getByTestId('likes')
    const submitButton = screen.getByText('add')

    await user.type(titleInput, 'testentry')
    await user.type(authorInput, 'john doe')
    await user.type(urlInput, 'default')
    await user.type(likesInput, '404')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testentry')
    expect(createBlog.mock.calls[0][0].author).toBe('john doe')
    expect(createBlog.mock.calls[0][0].url).toBe('default')
    expect(createBlog.mock.calls[0][0].likes).toBe('404')
})