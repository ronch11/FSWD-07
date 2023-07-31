import { useState, useEffect, useContext } from 'react'
import { useUserUpdate } from '../../UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import '../../Styles/Login.css';
import ApiContext from '../../ApiContext.jsx';
import TopNav from "../TopNav/TopNav.jsx";
import Login from './Login.jsx';
import Register from './Register.jsx';
function Auth({onLogIn, isLoggedIn}) {
    const api = useContext(ApiContext);

    const userUpdatedFunction = useUserUpdate();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (isLoggedIn){
        userUpdatedFunction(null);
        onLogIn(undefined);
        localStorage.setItem('logged_user', null);
      }
    }, []);
  
    const handleSignInSuccess = (user) => {
      alert("Login successful");
      navigate('/Home');
      userUpdatedFunction(user);
      onLogIn(user);
    }
    
    const handleSignUpSuccess = (user) => {
      alert("Register successful");
      navigate('/Home');
      userUpdatedFunction(user);
      onLogIn(user);
    }
  
    const handleRegister = (event) => {
      console.log('Register');
      let container = document.querySelector(".container");
      container.classList.add("sign-up-mode");
    }
  
    const handleLogin = (event) => {
      console.log('Login');
      let container = document.querySelector(".container");
      container.classList.remove("sign-up-mode");
  
    }
  
  
    return (
      <>
        {<TopNav/>}
        <div>
          <title>Sign in &amp; Sign up Form</title>
          <div className="container">
            <div className="forms-container">
              <div className="signin-signup">
                <Login onSuccess={handleSignInSuccess} />
  
                <Register onSuccess={handleSignUpSuccess}/>
                
              </div>
            </div>
            <div className="panels-container">
              <div className="panel left-panel">
                <div className="content">
                  <h3>New here ?</h3>
                  <p>
                    Sign up in a simple process!
                  </p>
                  <button className="btn transparent" id="sign-up-btn" onClick={handleRegister}>
                    Sign up
                  </button>
                </div>
              </div>
              <div className="panel right-panel">
                <div className="content">
                  <h3>One of us ?</h3>
                  <p>
                    Sign in using your username and password!
                  </p>
                  <button className="btn transparent" id="sign-in-btn" onClick={handleLogin} >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};
  
export default Auth
