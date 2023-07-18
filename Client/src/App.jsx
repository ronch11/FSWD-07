import Login from './Components/Login'
import { useUserUpdate } from './UserContext'
import { useState } from 'react'
import {BrowserRouter, Route, Routes, NavLink, Navigate } from 'react-router-dom'
import Profile from './Components/Profile'
import Home from './Components/Home'
import Video from './Components/Video'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUserName] = useState('')
    const userUpdated = useUserUpdate();
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
        setUserName(user?.username ?? '');
        userUpdated(user);
    }
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
                
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Login" element={<Login onLogIn={handleSubmit} isLoggedIn={isLoggedIn} />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
