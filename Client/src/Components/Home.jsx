import React from 'react'
import { useUser } from "../UserContext";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../ApiContext";
import VideoButton from './VideoButton';
function Home() {
    const user = useUser();
    const api = useContext(ApiContext);
    const [videos, setVideos] = useState([]);
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
    <div>
      {
            videos.map(video => {
                return <VideoButton video={video} baseurl={api.defaults.baseURL} />
            })
      }
    </div>
  )
}

export default Home
