import React, { useEffect, useState, useContext } from 'react'
// import AuthContext from '../context/AuthContext'
import useAxios from '../utils/useAxios'

const HomePage = () => {
    // const { authTokens, logoutUser } = useContext(AuthContext)
    const [notes, setNotes] = useState([])
    const api = useAxios()

    useEffect(() => {
        getNotes()
    }, [])

    const getNotes = async () => {
        const res = await api.get('/api/notes')

        if(res && res.status === 200) {
            setNotes(res.data)
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

