import { useState } from 'react'

const BlogForm = ({ createBlog, user }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const [newLikes, setNewLikes] =useState(0)

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            likes: newLikes,
            user: user
        })

        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes(0)
    }

    return (
        <form onSubmit={addBlog}>
            <h2>blogs</h2>
            <div>
                title: <input
                    id="title"
                    value={newTitle}
                    onChange={event => setNewTitle(event.target.value)}
                    data-testid="title"
                />
            </div>
            <div>
                author: <input
                    id="author"
                    value={newAuthor}
                    onChange={event => setNewAuthor(event.target.value)}
                    data-testid="author"
                />
            </div>
            <div>
                url: <input
                    id="url"
                    value={newUrl}
                    onChange={event => setNewUrl(event.target.value)}
                    data-testid="url"
                />
            </div>
            <div>
                likes: <input
                    id="likes"
                    type='number'
                    value={newLikes}
                    onChange={event => setNewLikes(event.target.value)}
                    data-testid="likes"
                />
            </div>
            <button id="submit" type='submit'>add</button>
        </form>
    )
}

export default BlogForm