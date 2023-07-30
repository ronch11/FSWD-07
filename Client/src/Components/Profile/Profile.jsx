import VideoUploader from "../Video/Upload.jsx";
import VideoComponent from "../Video/Videos.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext.jsx";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../../ApiContext.jsx";
import "../../Styles/Profile.css";


const Profile = () => {
    const navigate = useNavigate();
    const user = useUser();
    if (!user || Object.keys(user).length === 0) navigate('/Login');
    const api = useContext(ApiContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getVideos = async () => {
        api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
        return api.get(`/videos/postedBy/${user._id}`)
        .then(response => {console.log(response.data); setVideos(response.data)})
        .catch(err => console.error(err));
    }
    useEffect(() => {
        getVideos();
    }, []);

    return (
        <div>
            <h1>Profile</h1>
            <h2>{user.username}</h2>
            <VideoComponent videos={videos} getVideos={getVideos} />
            <VideoUploader getVideos={getVideos}/>
        </div>
    );
}

export default Profile;
