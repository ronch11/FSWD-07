import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react';
import ApiContext from '../../ApiContext';
import VideoList from '../Video/VideoList';
function Playlist() {
    const [videos, setVideos] = useState([]);
    const [playlistName, setPlaylistName] = useState('');
    let { playlistId } = useParams();
    const api = useContext(ApiContext);
    useEffect(() => {
        //Get videos details from the server
        const token = localStorage.getItem('access_token')
        // set the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        api.get('/playlists/light/' + playlistId).then((response) => {
            const playlist = response.data;
            console.log(playlist);
            setVideos(playlist.videos);
            setPlaylistName(playlist.name);
        }
        ).catch((error) => {
            console.log(error)
        });
    }, [])
    return (
        <div>{
                videos.length > 0 ? <h3>{playlistName}</h3> : <h3>The Playlist is empty!</h3>
            }
            <VideoList videos={videos} detailsIncluded={false} />   
        </div>
    )
}

export default Playlist
