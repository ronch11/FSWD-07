import React, { useEffect, useState, useContext } from 'react';
import ApiContext from "../ApiContext";
import { useUser } from "../UserContext";
import '../Styles/Videos.css'

function VideoComponent() {
    const [videos, setVideos] = useState([]);
    const api = useContext(ApiContext);
    const user = useUser();

    const getVideos = async () => {
        return api.get(`/videos/${user._id}`)
        .then(response => {console.log(response.data); setVideos(response.data)})
        .catch(err => console.error(err));
    }


    useEffect(() => {
        getVideos();
    }, []);

    return (
        <div className="video-list">
      {videos.map((video, index) => (
        <div key={index} className="video-item">
          <h2>{video.title}</h2>
          {video.views && <p>Views: {video.views}</p>}
          <video src={api.defaults.baseURL + '/videos/preview/' + video._id} controls />
        </div>
      ))}
    </div>
    );
}

export default VideoComponent;