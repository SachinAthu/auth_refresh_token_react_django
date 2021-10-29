import React, { useEffect, useState, useContext } from 'react'

import AuthContext from '../context/AuthContext'
import { BASE_URL } from '../utils/config'


const HomePage = () => {
    const { authTokens, logoutUser } = useContext(AuthContext)
    const [notes, setNotes] = useState([])

    useEffect(() => {
        getNotes()
    }, [])

    const getNotes = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/notes`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authTokens.access}`
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
        } catch (err) {
            console.log(err)
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

