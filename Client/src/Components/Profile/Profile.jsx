import VideoUploader from "../Video/Upload.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext.jsx";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../../ApiContext.jsx";
import "../../Styles/Profile.css";
import VideoList from "../Video/VideoList.jsx";
import { useLoadingUpdate } from '../../LoadingContext';

const Profile = () => {
    const navigate = useNavigate();
    const user = useUser();
    if (!user || Object.keys(user).length === 0) navigate('/Login');
    const api = useContext(ApiContext);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const setLoading = useLoadingUpdate();
    const getVideos = async () => {

        api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
        setLoading(true);
        return api.get(`/videos/postedBy/${user._id}`)
        .then(response => {console.log(response.data); setVideos(response.data)})
        .catch(err => console.error(err))
        .finally(() => {setLoading(false);});
    }

    const handleVideoDeleted = (videoId) => {
        
    }

    const editVideo = async (e) => {
        navigate('/editvideo/' + e.target.value);
    }
  
    const deleteVideo = async (e) => {
        const videoId = e.target.value;
        let confirmAction = confirm("Are you sure you want to delete this video?");
        if (confirmAction){
            api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
            return api.delete(`/videos/delete/${e.target.value}`)
            .then(response => {setVideos(videos.filter((video) => video._id !== videoId));})
            .catch(err => console.error(err));
        }else{
            return;
        }
    }

    useEffect(() => {
        getVideos();
    }, []);

    return (
        <div>
            <h1>Profile</h1>
            <h2>{user.username}</h2>
            <VideoUploader getVideos={getVideos}/>
            <VideoList videos={videos} detailsIncluded={false} EditVideo={editVideo} DeleteVideo={deleteVideo}/>
        </div>
    );
}

export default Profile;
