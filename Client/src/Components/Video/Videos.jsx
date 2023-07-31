import React, { useEffect, useState, useContext } from 'react';
import ApiContext from "../../ApiContext.jsx";
import { useUser } from "../../UserContext.jsx";
import '../../Styles/Videos.css'
import VideoButton from './VideoButton.jsx';
import { useNavigate } from 'react-router-dom';

function VideoComponent({videos, getVideos}) {
    const api = useContext(ApiContext);
    const user = useUser();
    const navigate = useNavigate();
    

    const editVideo = async (e) => {
      navigate('/editvideo/' + e.target.value);
    }

    const deleteVideo = async (e) => {
      let confirmAction = confirm("Are you sure you want to delete this video?");
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
        <div className="order-vidoes">
        <VideoButton key={index} video={video} baseurl={api.defaults.baseURL} />
        <button className="Edit-Bottom" value={video._id} onClick={editVideo}>Edit</button>
        <button className="Delete-Bottom" value={video._id} onClick={deleteVideo}>Delete</button>
        </div>
      ))}
    </div>
    );
}

export default VideoComponent;