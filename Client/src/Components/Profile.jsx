import VideoUploader from "../Components/Upload";
import VideoComponent from "./Videos";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { useEffect, useState, useContext } from "react";
import ApiContext from "../ApiContext";


const Profile = () => {
    
    const user = useUser();
    const api = useContext(ApiContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    return (
        <div>
            <h1>Profile</h1>
            <h2>{user.username}</h2>
            <VideoComponent />
            <VideoUploader />
        </div>
    );
}

export default Profile;
