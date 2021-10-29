import React, { useEffect, useState, useContext } from 'react'

// import AuthContext from '../context/AuthContext'
import useFetch from '../utils/useFetch'

const HomePage = () => {
    // const { authTokens, logoutUser } = useContext(AuthContext)
    const [notes, setNotes] = useState([])

    const api = useFetch()

    useEffect(() => {
        getNotes()
    }, [])

    const getNotes = async () => {
        const { res, data } = await api('/api/notes')

        if(res && res.status === 200) {
            setNotes(data)
        } else {
            console.log("Getting notes failed!")
        }
    }

    return (
        <div>
            <p>You are logged in to the Home page</p>

            <ul>
                {notes.map(note => (
                    <li key={note.id}>{note.body}</li>
                ))}
            </ul>
        </div>
    )
}

export default HomePage

