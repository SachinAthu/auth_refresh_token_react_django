import React, { useEffect, useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {
    const { authTokens, logoutUser } = useContext(AuthContext)
    const [notes, setNotes] = useState([])

    useEffect(() => {
        getNotes()
    }, [])

    const getNotes = async () => {
        const res = await fetch('http://127.0.0.1:8000/api/notes', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access) 
            }
        })
        const data = await res.json()
        if(res.status === 200) {
            setNotes(data)
        } else if(res.status === 401) {
            logoutUser()
        }else {
            console.log("Getting notes failed!")
        }
        // try {
        // } catch (err) {
        //     console.log(err)
        // }
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

