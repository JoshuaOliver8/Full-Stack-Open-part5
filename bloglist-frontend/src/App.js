import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState('')

    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })
            blogService.setToken(user.token)
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            setUser(user)
            setUsername('')
            setPassword('')
            setSuccessMessage(`${user.name} was successfully logged on`)
            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000)
        } catch (exception) {
            setErrorMessage('wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()

        window.localStorage.removeItem('loggedBlogappUser')

        blogService.setToken('')
        setUser('')
        setUsername('')
        setPassword('')
        setSuccessMessage('user was logged out')
        setTimeout(() => {
            setSuccessMessage(null)
        }, 5000)
    }

    const addBlog = (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogService
            .create(blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog).sort((a,b) => b.likes - a.likes))
                setSuccessMessage(`a new blog ${returnedBlog.title} ${returnedBlog.author} added`)
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 5000)
            })
    }

    const addLike = (id, blogObject) => {
        blogService
            .update(id, blogObject)
            .then(returnedBlog => {
                setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog).sort((a,b) => b.likes - a.likes))
            })
    }

    const deleteBlog = (blogObject) => {
        try {
            if(window.confirm(`Remove ${blogObject.title} ${blogObject.author}`)) {
                blogService
                    .deleteObject(blogObject.id)
                    .then(() => {
                        setBlogs(blogs.filter(b => b !== blogObject))
                        setSuccessMessage(`Deleted ${blogObject.title} ${blogObject.author}`)
                        setTimeout(() => {
                            setSuccessMessage(null)
                        }, 5000)
                    })
            }
        } catch (error) {
            setErrorMessage('unable to delete blog')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    id="username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    id="password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button id="login-button" type="submit">login</button>
        </form>
    )

    if (!user) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification message={successMessage} success={true}/>
                <Notification message={errorMessage} success={false}/>
                {loginForm()}
            </div>
        )
    }

    return (
        <div>
            <h1>blogs app</h1>

            <Notification message={successMessage} success={true}/>
            <Notification message={errorMessage} success={false}/>

            <div>
                <p>{user.name} logged in <button id="logOut" onClick={handleLogout}>log out</button></p>
            </div>

            <h2>create a blog</h2>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} user={user}/>
            </Togglable>

            <h2>blogs</h2>
            {blogs.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    incrementLikes={addLike}
                    removeBlog={deleteBlog}
                    showRemoveButton={(user && user.username === blog.user.username)}
                />
            )}
        </div>
    )
}

export default App