import React from 'react'
import { useUser } from "../../UserContext.jsx";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../../ApiContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import Comment from '../Comments/Comment.jsx';
import CommentSubmitter from '../Comments/CommentSubmitter.jsx';
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
    console.log(videoid);  
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
                <div>
                    <p>{videoDetails.title}</p>
                    <p>Channel: {videoDetails.channel.name}</p>
                    <p>Views: {videoDetails.views}</p>
                    <button className={reaction === 'like' ? 'ButtonPressed' : ''} onClick={reaction === 'like' ? clearReaction : likeVideo}>Likes: {likes}</button>
                    <button className={reaction === 'dislike' ? 'ButtonPressed' : ''} onClick={reaction === 'dislike' ? clearReaction : dislikeVideo}>Dislikes: {dislikes}</button>
                    <button onClick={copyLink}>Share</button>
                    <div>
                        <p>Comments</p>
                        <CommentSubmitter videoid={videoid} addComment={(comment) => {setComments([...comments, comment])}} />
                        <ul>
                            { comments.map(comment => {
                                return <li><Comment comment={comment}/></li>
                            })}
                        </ul>
                    </div>
                </div>
            )
        }
    }

  return (
    <div>
      <video width={1000} src={videoUrl} controls></video>
        {detailsElem()}
    </div>
  )
}

export default Video
