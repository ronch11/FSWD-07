import React from 'react'
import { useUser } from "../UserContext";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../ApiContext";
import { useParams, useNavigate } from "react-router-dom";

function Video() {
    let {videoid} = useParams();
    const api = useContext(ApiContext);
    const navigate = useNavigate();
    const [videoDetails, setVideoDetails] = useState(null);
    const [reaction, setReaction] = useState('');
    const [dislikes, setDislikes] = useState(0);
    const [likes, setLikes] = useState(0);
    const [videoUrl, setVideoUrl] = useState('');
    console.log(videoid);  
    useEffect(() => {
        // set access token
        api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
        api.get(`/videos/details/${videoid}`).then(response => {
            console.log(response);
            setVideoDetails(response.data);
            setLikes(response.data.reactions.like);
            setDislikes(response.data.reactions.dislike);
        }).catch(error => {
            console.log(error);
            if (error.response.status === 401){
                navigate('/Login');
            }
            else if (error.response.status === 404){
                navigate('/404');
            }
        });
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
    }, [])

    function likeVideo(){
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
        api.post(`/videos/react/${videoid}`, {
            reaction: 'dislike'
        }).then(response => {
            console.log(response);
            if (reaction === 'like'){
                setLikes(likes - 1);
            }
            setDislikes(dislikes + 1);
            setReaction('dislike');
        }
        );
    }

    function clearReaction(){
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

    function detailsElem(){
        if (videoDetails){
            return (
                <div>
                    <p>{videoDetails.title}</p>
                    <p>Channel: {videoDetails.channel.name}</p>
                    <p>Views: {videoDetails.views}</p>
                    <button className={reaction === 'like' ? 'ButtonPressed' : ''} onClick={reaction === 'like' ? clearReaction : likeVideo}>Likes: {likes}</button>
                    <button className={reaction === 'dislike' ? 'ButtonPressed' : ''} onClick={reaction === 'dislike' ? clearReaction : dislikeVideo}>Dislikes: {dislikes}</button>
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
