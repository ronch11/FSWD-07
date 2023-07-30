import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useEffect, useContext, useState } from 'react';
import ApiContext from '../../ApiContext.jsx';
import VideoButton from '../Video/VideoButton.jsx';
function VideoList({videos, detailsIncluded}) {
    // structure of the video object: [...video ids]
    // useEffect(() => {
    //     //Get videos details from the server
    // }, [videos])
    const api = useContext(ApiContext);
    if(detailsIncluded === undefined && videos.length > 0 && !videos[0].title) detailsIncluded = false;
    const [videosDetails, setVideosDetails] = useState(videos);
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
    return (
        <div>
        <ul>
            {videosDetails.map((video, index) => {
                return <li key={index}>
                        <VideoButton video={video} baseurl={api.defaults.baseURL}/>
                    </li>
            })}
        </ul>
        </div>
    )
}

export default VideoList
