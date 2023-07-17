import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ApiContext from "../ApiContext";
const VideoUploader = () => {
  // get access token from local storage
  const access_token = localStorage.getItem('access_token');
  // create axios instance
  const api = useContext(ApiContext);
  const uploadVideo = (file) => {
    const formData = new FormData();
    formData.append('video', file);

    api.post('/videos/upload', formData, {
      headers: {
        'Authorization': `Bearer ${access_token}` // Use your authentication scheme here
      }
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      uploadVideo(e.target.files[0]);
    }
  };

  return (
    <div>
      <input type='file' accept='video/*' onChange={onFileChange} />
    </div>
  );
};

export default VideoUploader;