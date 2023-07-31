import React from 'react'
import { useUser } from "../../UserContext.jsx";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../../ApiContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import Comment from '../Comments/Comment.jsx';
import CommentSubmitter from '../Comments/CommentSubmitter.jsx';
import '../../Styles/Video.css';
import VideoList from './VideoList.jsx';
import PlaylistAdder from './PlaylistAdder.jsx';


function Video() {
    let {videoid} = useParams();
    const api = useContext(ApiContext);
    const navigate = useNavigate();
    const [videoDetails, setVideoDetails] = useState(null);
    const [reaction, setReaction] = useState('');
    const [dislikes, setDislikes] = useState(0);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    console.log(videoid);
    const user = useUser();

    // get video, details, recommendations and comments
    useEffect(() => {
        // set access token
        api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
        // request video details
        api.get(`/videos/details/${videoid}`).then(response => {
            console.log(response);
            setVideoDetails(response.data);
            setLikes(response.data.reactions.like);
            setDislikes(response.data.reactions.dislike);
            if(response.data.reactions.user) setReaction(response.data.reactions.user);
        }).catch(error => {
            console.log(error);
            if (error.status === 401){
                navigate('/Login');
            }
            else if (error.status === 404){
                navigate('/404');
            }
        });

        // request video
        // set response type to blob for this request
        api.get(api.defaults.baseURL + '/videos/watch/' + videoid, {
            responseType: 'blob'
            }
          ).then(response => {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            console.log(url);
            setVideoUrl(url);

          });

        // request comments
        api.get('/comments/' + videoid).then(response => {
            console.log(response);
            setComments(response.data);
        });

        // request recommendations
        api.get("/videos/recommendations").then(response => {
            console.log(response);
            const videos = response.data;
            // remove current video from recommendations
            const filteredVideos = videos.filter(video => video._id !== videoid);
            setRecommendations(response.data);
        })

    }, [])

    function likeVideo(){
        // check if access token is present
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken){
            navigate('/Login');
        }
        if (reaction !== 'like'){
            api.post(`/videos/react/${videoid}`, {
                reaction: 'like'
            }).then(response => {
                console.log(response);
                if (reaction === 'dislike'){
                    setDislikes(dislikes - 1);
                }
                setLikes(likes + 1);
                setReaction('like');
            }
            );
        }
        
    }

    function dislikeVideo(){
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken){
            navigate('/Login');
        }
        api.post(`/videos/react/${videoid}`, {
            reaction: 'dislike'
        }).then(response => {
            console.log(response);
            if (reaction === 'like'){
                setLikes(likes - 1);
            }
            setDislikes(dislikes + 1);
            setReaction('dislike');
        });
    }

    function clearReaction(){
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken){
            navigate('/Login');
        }
        api.post(`/videos/react/${videoid}`, {
            reaction: ''
        }).then(response => {
            console.log(response);
            if (reaction === 'like'){
                setLikes(likes - 1);
            }
            else if (reaction === 'dislike'){
                setDislikes(dislikes - 1);
            }
            setReaction('');
        }
        );
    }

    const copyLink = async (e) => {
        e.preventDefault();
        const currentUrl = window.location.href;
        await navigator.clipboard.writeText(currentUrl);
        alert('Link copied to clipboard');
    }

    function detailsElem(){
        if (videoDetails){
            return (
                <div className="view-video">

                    <p className="video-name">{videoDetails.title}</p>
                    <button className = "like-bottom" onClick={reaction === 'like' ? clearReaction : likeVideo}>Likes: {likes}</button>
                    <button className = "dislike-bottom" onClick={reaction === 'dislike' ? clearReaction : dislikeVideo}>Dislikes: {dislikes}</button>
                    <button className="share-bottom" onClick={copyLink}>Share</button>
                    <p className="channel-name">{videoDetails.channel.name}</p>
                    <p className="view-count">Views: {videoDetails.views}</p>

                    <div className="playlist-adder">
                        <PlaylistAdder videoId={videoid} />
                    </div>

                    <div>
                        <p className="create-Comments">Comments</p>
                        <CommentSubmitter videoid={videoid} addComment={(comment) => {setComments([...comments, comment])}} />
                        <ul>
                            { comments.map(comment => {
                                // eslint-disable-next-line react/jsx-key
                                return <li className="comment"><Comment comment={comment}/></li>
                            })}
                        </ul>
                    </div>
                </div>
            )
        }
    }

  return (
      <div>
          <div className="more-video">
                <VideoList videos={recommendations} detailsIncluded={true} />
          </div>

          {/* Video player and details */}
          <div className="video-details-container">
              <video className="video-item" src={videoUrl} controls></video>
              {detailsElem()}
          </div>
      </div>
  )
}

export default Video
