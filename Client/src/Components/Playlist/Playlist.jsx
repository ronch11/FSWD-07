import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiContext from '../../ApiContext';
import VideoList from '../Video/VideoList';
import { useLoadingUpdate } from '../../LoadingContext';
function Playlist() {
    const [videos, setVideos] = useState([]);
    const [playlistName, setPlaylistName] = useState('');
    let { playlistId } = useParams();
    const api = useContext(ApiContext);
    const navigate = useNavigate();
    const setLoading = useLoadingUpdate();
    useEffect(() => {
        //Get videos details from the server
        const token = localStorage.getItem('access_token')
        // set the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setLoading(true);
        api.get('/playlists/light/' + playlistId).then((response) => {
            const playlist = response.data;
            setVideos(playlist.videos.map(video => { return { _id: video } }));
            setPlaylistName(playlist.name);
        }
        ).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoading(false);
        });
    }, [])

    const handleDeletePlaylist = (e) => {
        e.preventDefault();
        let confirmAction = confirm("Are you sure you want to delete this playlist?");
        if (confirmAction){
            api.delete('/playlists/' + playlistId).then((response) => {
                console.log(response);
                navigate('/Playlists');
            }).catch((error) => {
                console.log(error);
            }
            );
        }else{
            return;
        }
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
    const handleRemoveFromPlaylist = (e) => {
        e.preventDefault();
        const videoId = e.target.value;
        removeFromPlaylist(playlistId, videoId);
    }

    return (
        
        <div>
            <h2>{playlistName}</h2>
            {
                videos.length > 0 ? '' : <h3>The Playlist is empty!</h3>
            }
            <button onClick={handleDeletePlaylist}>Delete Playlist</button>
            <VideoList videos={videos} detailsIncluded={false} DeleteVideo={handleDeletePlaylist} />   
        </div>
    )
}

export default Playlist
