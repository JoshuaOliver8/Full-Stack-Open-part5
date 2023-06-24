import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('blog renders the blog title and author, but does not render the URL or likes by default', () => {
    const blog = {
        title: 'test entry',
        author: 'root',
        url: 'default',
        likes:1
    }

    render(<Blog blog={blog} />)
    const element = screen.getByText('test entry root')
    expect(element).toBeDefined()
})

test('blog renders url and likes when view details viewButton is clicked', async () => {
    const creator = {
        name: 'root'
    }

    const blog = {
        title: 'test entry',
        author: 'root',
        url: 'default',
        likes:1,
        user: creator
    }

    const { container } = render(<Blog blog={blog}  />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const details = container.querySelector('.details')
    expect(details).toHaveTextContent('test entry root hidedefault1 likesroot')
})

test('if likes viewButton is clicked twice, the event handler is called twice', async () => {
    const creator = {
        name: 'root'
    }

    const blog = {
        title: 'test entry',
        author: 'root',
        url: 'default',
        likes:1,
        user: creator
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog}  incrementLikes={mockHandler}/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('likes')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})