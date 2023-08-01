import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/VideoButton.css'; // Import the CSS file

function VideoButton({ video, baseurl }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/video/${video._id}`);
  };

  return (
    <button className="video-button" onClick={handleClick}>
      <div>
        <img className="video-thumbnail" src={`${baseurl}/videos/thumb/${video._id}`} alt="Video Thumbnail" />
      </div>
      <div className="video-info">
        <p className="video-title">{video.title}</p>
        <div className="video-metadata">
          {video.available !== undefined && !video.available && <span style={{color: 'red'}}>Not available</span>}
          <span className="video-metadata-item">{video.userId}</span>
          <span className="video-metadata-item">{video.views} views</span>
          <span className="video-metadata-item">{video.date}</span>
        </div>
      </div>
    </button>
  );
}

export default VideoButton;