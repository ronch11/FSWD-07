import React from 'react'
import { useEffect, useState, useContext } from 'react'
import Playlist from '../Playlist/Playlist'
import ApiContext from '../../ApiContext.jsx';
function History() {
    const [videos, setVideos] = useState([]);
    const api = useContext(ApiContext);
    useEffect(() => {
        //Get videos details from the server
        const token = localStorage.getItem('access_token')
        // set the authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        api.get('/history').then((response) => { 
            console.log(response.data)
            setVideos(response.data)
        }
        ).catch((error) => {
            console.log(error)
        }
        );
    }, [])
  return (
    <div>
      <Playlist videos={videos}/>
    </div>
  )
}

export default History
