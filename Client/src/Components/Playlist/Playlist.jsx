import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import VideoList from '../Video/VideoList';
function Playlist({playlistId}) {
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        //Get videos details from the server
        const token = localStorage.getItem('access_token')
        // set the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        api.get('/playlists/light/' + playlistId).then((response) => {
            const playlist = response.data;
            console.log(playlist);
            setVideos(playlist.videos);
        }
        ).catch((error) => {
            console.log(error)
        });
    }, [])
    return (
        <div>
            <VideoList videos={videos} detailsIncluded={false} />   
        </div>
    )
}

export default Playlist
