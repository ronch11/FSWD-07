import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useEffect, useContext, useState } from 'react';
import ApiContext from '../../ApiContext.jsx';
import VideoButton from '../Video/VideoButton.jsx';
import '../../Styles/Videos.css';
function VideoList({videos, detailsIncluded, allowEdit, allowDelete, onVideoDeleted }) {
    // structure of the video object: [...video ids]
    // useEffect(() => {
    //     //Get videos details from the server
    // }, [videos])
    const api = useContext(ApiContext);
    if(detailsIncluded === undefined && videos.length > 0 && !videos[0].title) detailsIncluded = false;
    const [videosDetails, setVideosDetails] = useState(videos);
    const navigate = useNavigate();
    useEffect(() => {
        setVideosDetails(videos);
    }, [videos])
    
    console.log('vid list: ', videosDetails)
    if (!detailsIncluded) {
        useEffect(() => {
            //Get videos details from the server
            const token = localStorage.getItem('access_token')
            // set the authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            const promises = videos.map((video) => {
                return api.get('/videos/details/' + video._id)
            })
            Promise.all(promises).then((responses) => {
                console.log(responses)
                setVideosDetails(responses.map((response) => {
                    return response.data
                }))
            }).catch((error) => {
                console.log(error)
            })
        }, [videos])
    }

    const editVideo = async (e) => {
        navigate('/editvideo/' + e.target.value);
    }
  
    const deleteVideo = async (e) => {
        let confirmAction = confirm("Are you sure you want to delete this video?");
        if (confirmAction){
            api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
            return api.delete(`/videos/delete/${e.target.value}`)
            .then(response => {onVideoDeleted(e.target.value);})
            .catch(err => console.error(err));
        }else{
            return;
        }
    }

    return (
        <div className="video-list">
        <ul style={{ listStyle: 'none' }}>
            {videosDetails.map((video, index) => {
                return <li className="order-vidoes" key={index}>
                        <VideoButton video={video} baseurl={api.defaults.baseURL}/>
                        {allowEdit ? <button className="Edit-Bottom" value={video._id} onClick={editVideo}>Edit</button> : ''}
                        {allowDelete ? <button className="Delete-Bottom" value={video._id} onClick={deleteVideo}>Delete</button> : ''}
                    </li>
            })}
        </ul>
        </div>
    )
}

export default VideoList
