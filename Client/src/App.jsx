import Login from './Components/Login/Login.jsx'
import { useUserUpdate } from './UserContext'
import { useEffect, useState, useContext } from 'react'
import {BrowserRouter, Route, Routes, NavLink, Navigate } from 'react-router-dom'
import Profile from './Components/Profile/Profile.jsx'
import Home from './Components/Home/Home.jsx'
import Video from './Components/Video/Video.jsx'
import NotFound404 from './Components/NotFound/NotFound.jsx'
import EditVideo from './Components/Video/EditVideo.jsx'
import ApiContext from './ApiContext'
import Register from "./Components/Register/Register.jsx";
import './Styles/NavBar.css';
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./Components/resetPassword/resetPassword.jsx";
import History from "./Components/History/History.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
    const userUpdated = useUserUpdate();
    const api = useContext(ApiContext);
    // useEffect(() => {
    //   const user = JSON.parse(localStorage.getItem('logged_user'))
    //   if (user !== undefined) {
    //     if (userUpdate){
    //       userUpdate(user)
    //     }
    //     handleLogin(user)
    //   }
    // }, [])

    


    const handleSubmit = (user) => {
        setIsLoggedIn(user !== undefined);
        if(user === undefined){
            // set access token to null
            localStorage.setItem('access_token', '');
        }
        setUserName(user?.username ?? '');
        userUpdated(user);
    }

    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        // if user doesnt exist, use access token to get user details
        console.log(accessToken, ' is access token');
        if (accessToken){
            console.log('access token exists, getting user details');
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            api.get('users/user').then(response => {
                handleSubmit(response.data);
            })
        }
    }, [])

    function getNav(){
        if (isLoggedIn){
            return (
                <nav>
                    <ul className="navbar" id="mynavnar">
                        <li >
                            {userName}
                        </li>

                        <li>
                            <NavLink to="/Home" activeClassName="active">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Profile" activeClassName="active">Profile</NavLink>
                        </li>
                        <li>
                            <NavLink to="/History" activeClassName="active">History</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Playlist" activeClassName="active">Playlist</NavLink>
                        </li>
                        <li  style={{ marginLeft: "auto" }}>
                            <NavLink to="/Login">{isLoggedIn ? "Logout" : "Login"}</NavLink>
                        </li>
                    </ul>
                </nav>
            )
        }
    }

    return (
        <BrowserRouter>
            {getNav()}
            <Routes>
                <Route exact path="/" element={ isLoggedIn ? <Navigate to="/Profile" /> : <Navigate to="/Login" />}>

                </Route>
                <Route path="/Home" element={<Home />} />
                
                <Route path="/video/:videoid" element={<Video />}/>
                <Route path="/editvideo/:videoid" element={<EditVideo />}/>
                <Route path="/404" element={<NotFound404 />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Login" element={<Login onLogIn={handleSubmit} isLoggedIn={isLoggedIn} />} />
                <Route path="/Register" element={<Register />}/>
                <Route path="/Home" element={<Home />} />
                <Route path="/ForgotPassword" element={<ForgotPassword/>} />
                <Route path="/ResetPassword" element={<ResetPassword/>} />
                <Route path="/History" element={<History />}/>
                <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
