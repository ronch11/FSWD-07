// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useEffect, useState, useContext } from 'react'
import VideoList from '../Video/VideoList.jsx'
import ApiContext from '../../ApiContext.jsx';
import '../../Styles/History.css'
import { useLoadingUpdate } from '../../LoadingContext';
function History() {
    const [videos, setVideos] = useState([]);
    const api = useContext(ApiContext);
    const setLoading = useLoadingUpdate();
    useEffect(() => {
        //Get videos details from the server
        const token = localStorage.getItem('access_token')
        // set the authorization header
        setLoading(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        api.get('/history').then((response) => { 
            console.log(response.data)
            setVideos(response.data)
        }
        ).catch((error) => {
            console.log(error)
        }
        ).finally(() => {
            setLoading(false);
        });
    }, [])

    const handleDeleteHistory = (e) => {
        e.preventDefault();
        setLoading(true);
        api.delete('/history/').then((response) => {
            setVideos([])
        }
        ).catch((error) => {
            console.log(error)
        }
        ).finally(() => {
            setLoading(false);
        });
    }
    return (
      <div>
        <h1>History</h1>
        <button onClick={handleDeleteHistory}>Delete history</button>
        {videos.length === 0 && <h3>No history, whatever you'll watch will pop up here!</h3>}
        <VideoList videos={videos} detailsIncluded={false}/>
      </div>
    )
}

export default History
