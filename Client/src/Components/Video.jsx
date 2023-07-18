import React from 'react'
import { useUser } from "../UserContext";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../ApiContext";
import { useParams } from "react-router-dom";

function Video() {
    let {videoid} = useParams();
    const api = useContext(ApiContext);
    const [videoDetails, setVideoDetails] = useState(null);
    console.log(videoid);  
    useEffect(() => {
        api.get(`/videos/details/${videoid}`).then(response => {
            console.log(response);
            setVideoDetails(response.data);
        })
    }, [])
    function detailsElem(){
        if (videoDetails){
            return (
                <div>
                    <h1>{videoDetails.title}</h1>
                    <p>Channel: {videoDetails.channel.name}</p>
                    <p>Views: {videoDetails.views}</p>
                    <p>Likes: {videoDetails.likes}</p>
                    <p>Dislikes: {videoDetails.dislikes}</p>
                </div>
            )
        }
    }
  return (
    <div>
      <video width={1000} src={api.defaults.baseURL + '/videos/watch/' + videoid} controls></video>
        {detailsElem()}
    </div>
  )
}

export default Video
