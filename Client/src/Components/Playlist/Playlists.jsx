import React from 'react'
import { useEffect, useState, useContext } from 'react'
import ApiContext from '../../ApiContext';
import Playlist from './Playlist';
import { useNavigate } from 'react-router-dom';
import { useLoadingUpdate } from '../../LoadingContext';


function Playlists() {
    const api = useContext(ApiContext);
    const [playlists, setPlaylists] = useState([]);
    const [playlistName, setPlaylistName] = useState('');
    const setLoading = useLoadingUpdate();
    const navigate = useNavigate();
    useEffect(() => {
        //Get Playlists from the server
        const token = localStorage.getItem('access_token')
        // set the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setLoading(true);
        api.get('/playlists/').then((response) => {
            console.log(response.data)
            setPlaylists(response.data)
        }
        ).catch((error) => {
            console.log(error)
        }
        ).finally(() => {
            setLoading(false);
        });
    }, [])

    const handleAddPlaylist = (e) => {
        e.preventDefault();
        setLoading(true);
        api.post('/playlists/', {name: playlistName}).then((response) => {
            console.log(response.data)
            setPlaylists([...playlists, response.data])
            setPlaylistName('');
        }
        ).catch((error) => {
            console.log(error)
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            <h3>Add new playlist:</h3>
            <input type="text" value={playlistName} onChange={(e) => {setPlaylistName(e.target.value)}}/>
            <button onClick={handleAddPlaylist}>Add</button>
            {
                playlists.map((playlist) => {
                    return (<button onClick={() => {navigate('/Playlist/' + playlist._id)}}>
                        <img width={320} src={api.defaults.baseURL + '/videos/thumb/' + playlist.thumbVid}></img>
                        <p>{playlist.name}</p>
                        </button>)
                })
            }
        </div>
    )
}

export default Playlists
