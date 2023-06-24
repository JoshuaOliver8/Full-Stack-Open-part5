import { useState } from 'react'

const Blog = ({ blog, incrementLikes, removeBlog, showRemoveButton }) => {
    const [details, setDetails] = useState(false)

    const toggleDetails = () => {
        setDetails(!details)
    }

    const addLike = () => {
        incrementLikes(blog.id, { ...blog, likes: blog.likes + 1 })
    }

    const deleteBlog = () => {
        removeBlog(blog)
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    if (details) {
        return (
            <div style={blogStyle} className="details">
                <div>
                    {blog.title} {blog.author} <button onClick={toggleDetails}>hide</button>
                </div>
                <div>
                    {blog.url}
                </div>
                <div>
                    {blog.likes} <button  id="addLike" onClick={addLike}>likes</button>
                </div>
                <div>
                    {blog.user.name}
                </div>
                <div>
                    {showRemoveButton && <button id="removeButton" onClick={deleteBlog}>remove</button>}
                </div>
            </div>
        )
    } else {
        return (
            <div style={blogStyle}>
                {blog.title} {blog.author} <button onClick={toggleDetails}>view</button>
            </div>
        )
    }
}

export default Blog