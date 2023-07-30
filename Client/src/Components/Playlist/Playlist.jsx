import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
function Playlist({videos}) {
    // structure of the video object: [...video ids]
    useEffect(() => {
        //Get videos details from the server
    }, [videos])
    const navigate = useNavigate();
    return (
        <div>
        <ul>
            {videos.map((video, index) => {
                return <li key={index}>
                    <button onClick={() => navigate(`/video/${video}`)}>{video}</button>
                    </li>
            })}
        </ul>
        </div>
    )
}

export default Playlist
