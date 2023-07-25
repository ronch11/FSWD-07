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
                        <p>{video.title}</p>
                        <img width={320} src={baseurl + '/videos/thumb/' + video._id} controls></img>
                        <p>{video.userId} | {video.views} | {video.date} </p>
                    </button>
        </div>
    )
}

export default VideoButton
