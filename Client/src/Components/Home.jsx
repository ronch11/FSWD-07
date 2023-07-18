import React from 'react'
import { useUser } from "../UserContext";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../ApiContext";
import VideoButton from './VideoButton';
function Home() {
    const user = useUser();
    const api = useContext(ApiContext);
    const [videos, setVideos] = useState([]);

    const homeStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // This will create responsive grid layout for videos
      gridGap: '1rem', // Gap between videos
      padding: '1rem',
      boxSizing: 'border-box',
      margin: '0 auto',
      maxWidth: '1200px',
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        console.log(accessToken);
        // load videos for user
        // set access token header
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        api.get("/videos/recommendations").then(response => {
            console.log(response);
            setVideos(response.data);
        })
    }, [])
    

  return (
    <div style={homeStyle}>
      {
            videos.map(video => {
                return <VideoButton video={video} baseurl={api.defaults.baseURL} />
            })
      }
    </div>
  )
}

export default Home
