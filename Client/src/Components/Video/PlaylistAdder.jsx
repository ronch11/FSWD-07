// TODO:add component for adding videos to playlists under each video
import React from 'react'
import { useState, useEffect, useContext } from 'react';
import ApiContext from '../../ApiContext';

function PlaylistAdder({videoId}) {
    const [expanded, setExpanded] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const api = useContext(ApiContext);
    useEffect(() => {
        //Get Playlists from the server
        const token = localStorage.getItem('access_token')
        // set the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        api.get('/playlists/').then((response) => {
            console.log(response.data)
            setPlaylists(response.data)
        }
        ).catch((error) => {
            console.log(error)
        }
        );

        api.get('/playlists/withVideo/' + videoId).then((response) => {
            console.log(response.data)
            setSelectedPlaylists(response.data.map((playlist) => {
                return playlist._id
            }))
        }).catch((error) => {
            console.log(error)
        }
        );
    }, [])

    const addToPlaylist = (playlistId) => {
        api.post('/playlists/add/' + playlistId, {videos: [videoId]}).then((response) => {
            console.log(response.data)
            setSelectedPlaylists([...selectedPlaylists, playlistId])
        }
        ).catch((error) => {
            console.log(error)
        }
        );
    }

    const removeFromPlaylist = (playlistId) => {
        api.delete(`/playlists/remove/${playlistId}/${videoId}`).then((response) => {
            console.log(response.data)
            setSelectedPlaylists(selectedPlaylists.filter((id) => {
                return id !== playlistId
            }))
        }
        ).catch((error) => {
            console.log(error)
        }
        );
    }

    const handleAddToPlaylists = (e) => {
        if (e.target.checked) {
            // add video to selected playlist
            addToPlaylist(e.target.value)
        } else {
            // remove video from selected playlist
            removeFromPlaylist(e.target.value)
        }
    }
    return (
        <div> 
        <button onClick={() => {setExpanded(!expanded)}}>Add to playlist</button>
        {
            expanded ? (playlists.length <= 0 ? <p>No playlists</p> : playlists.map(
                (playlist) => {
                    return (
                        <div key={playlist._id}>
                        <input  type="checkbox" checked={selectedPlaylists.includes(playlist._id)} value={playlist._id} onChange={handleAddToPlaylists}/>
                        <label>{playlist.name}</label>
                        </div>
                    )
                }
            )) : ''
        }
        </div>
    )
}

export default PlaylistAdder
