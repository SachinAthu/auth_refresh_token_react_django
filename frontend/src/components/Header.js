import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    const { user, logoutUser } = useContext(AuthContext)

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <Link to="/">Home</Link>

                <span> | </span>

                {user ? (
                    <button onClick={logoutUser}>Logout</button>
                ): (
                    <Link to="/login">Login</Link>
                )}
            </div>

            {user ? <p>Hello {user.username}</p> : null}
        </div>
    )
}

export default Header
