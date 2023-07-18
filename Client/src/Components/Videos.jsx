import React, { useEffect, useState, useContext } from 'react';
import ApiContext from "../ApiContext";
import { useUser } from "../UserContext";
import '../Styles/Videos.css'
import VideoButton from './VideoButton';
import { useNavigate } from 'react-router-dom';
function VideoComponent({videos, getVideos}) {
    const api = useContext(ApiContext);
    const user = useUser();
    const navigate = useNavigate();
    

    const editVideo = async (e) => {
      navigate('/editvideo/' + e.target.value);
    }

    const deleteVideo = async (e) => {
      let confirmAction = confirm("Are you sure to delete this video?");
      if (confirmAction){
        api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
        return api.delete(`/videos/delete/${e.target.value}`)
        .then(response => {getVideos();})
        .catch(err => console.error(err));
      }else{
        return;
      }
    }

    



    return (
        <div className="video-list">
      {videos.map((video, index) => (
        <div>
        <VideoButton key={index} video={video} baseurl={api.defaults.baseURL} />
        <button value={video._id} onClick={editVideo}>Edit</button>
        <button value={video._id} onClick={deleteVideo}>Delete</button>
        </div>
      ))}
    </div>
    );
}

export default VideoComponent;