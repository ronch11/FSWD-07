import Login from './Components/Login'
import { useUserUpdate } from './UserContext'
import { useEffect, useState, useContext } from 'react'
import {BrowserRouter, Route, Routes, NavLink, Navigate } from 'react-router-dom'
import Profile from './Components/Profile'
import Home from './Components/Home'
import Video from './Components/Video'
import NotFound404 from './Components/NotFound'
import EditVideo from './Components/EditVideo'
import ApiContext from './ApiContext'
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
                    <ul className="navbar">
                        <li>
                            <NavLink to="/Login" activeClassName="active">{isLoggedIn ? "Logout" : "Login"}</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Todos" activeClassName="active">Todos</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Home" activeClassName="active">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Profile" activeClassName="active">Profile</NavLink>
                        </li>
                        <li style={{ marginLeft: "auto" }}>
                            {userName}
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
            </Routes>
        </BrowserRouter>
    )
}

export default App
