import React from 'react'
import { useNavigate } from "react-router-dom";

function VideoButton({video, baseurl}) {
    const navigate = useNavigate();
    const handleClick = (e) => {
        e.preventDefault();
        console.log(video._id);
        // redirect to video id page
        navigate(`/video/${video._id}`);
    }
    return (
        <div>
        <button onClick={handleClick}>
                        <h1>{video.title}</h1>
                        <img width={320} src={baseurl + '/videos/thumb/' + video._id} controls></img>
                    </button>
        </div>
    )
}

export default VideoButton
