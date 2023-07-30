import { useState, useEffect, useContext } from 'react'
import { useUserUpdate } from '../../UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import '../../Styles/Login.css';
import ApiContext from '../../ApiContext.jsx';
import TopNav from "../TopNav/TopNav.jsx";

const Login = ({onLogIn, isLoggedIn}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const api = useContext(ApiContext);
  async function getUser(username, password) {
    return api.post("/users/login", {
      username: username,
      password: password
    })
  }

  const userUpdatedFunction = useUserUpdate();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn){
      userUpdatedFunction(null);
      onLogIn(undefined);
      localStorage.setItem('logged_user', null);
    }
  }, []);


  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    //console.log(await getUsers())
    if (username === '') {
      console.log('Login Failed');
      setLoginError('Please enter a username');
      return;
    }
    if (password === '') {
      console.log('Login Failed');
      setLoginError('Please enter a password');
      return;
    }
    getUser(username, password).then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        alert("Login successful");
        console.log(response)
        const user = response.data.user;
        // get cookie from response
        const cookie = response.data.accessToken;
        // set cookie
        localStorage.setItem('access_token', cookie);
        navigate('/Home');
        userUpdatedFunction(user);
        onLogIn(user);
      }
      else {
        console.log('Login Failed');
        setLoginError('Mismatched password');
      }
    }).catch((error) => {
      console.log(error)
      setLoginError('Error logging in');
    });

  };


  // const handleSubmitRegister = (event) => {
  //   console.log('Register');
  // };

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
              <form action="#" className="sign-in-form">
                <h2 className="title">Sign in</h2>
                <div className="input-field">
                  <i className="fas fa-user" />
                  <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <i className="fas fa-lock" />
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button className="btn solid" type="submit" onClick={handleSubmitLogin} >Sing In</button>
                <p className="social-text">Or Sign in with social platforms</p>
                <div className="social-media">
                  <a href="#" className="social-icon">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-twitter" />
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-google" />
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-linkedin-in" />
                  </a>
                </div>
              </form>


              <form action="#" className="sign-up-form">
                <h2 className="title">Sign up</h2>
                {/*<div className="input-field">*/}
                {/*  <i className="fas fa-user" />*/}
                {/*  <input*/}
                {/*      type="text"*/}
                {/*      id="username"*/}
                {/*      value={username}*/}
                {/*      onChange={(event) => setUsername(event.target.value)}*/}
                {/*  />*/}
                {/*</div>*/}
                {/*<div className="input-field">*/}
                {/*  <i className="fas fa-envelope" />*/}
                {/*  <input*/}
                {/*    type="password"*/}
                {/*    id="password"*/}
                {/*    value={password}*/}
                {/*    onChange={(event) => setPassword(event.target.value)}*/}
                {/*  />*/}
                {/*</div>*/}
                {/*<div className="input-field">*/}
                {/*  <i className="fas fa-lock" />*/}
                {/*  <input*/}
                {/*      type="text"*/}
                {/*      id="email"*/}
                {/*      value={email}*/}
                {/*      onChange={(event) => setemail(event.target.value)}*/}
                {/*  />*/}
                {/*</div>*/}
                {/*<div className="input-field">*/}
                {/*  <i className="fas fa-lock" />*/}
                {/*    <input*/}
                {/*        ype="text"*/}
                {/*        id="firstName"*/}
                {/*        value={firstName}*/}
                {/*        onChange={(event) => setfirstName(event.target.value)}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div className="input-field">*/}
                {/*    <i className="fas fa-lock" />*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        id="lastName"*/}
                {/*        value={lastName}*/}
                {/*        onChange={(event) => setlastName(event.target.value)}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div className="input-field">*/}
                {/*    <i className="fas fa-lock" />*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        id="phone"*/}
                {/*        value={phone}*/}
                {/*        onChange={(event) => setphone(event.target.value)}*/}
                {/*    />*/}
                {/*</div>*/}

                <button type="submit" className="btn" >Sign Up</button>
                <p className="social-text">Or Sign up with social platforms</p>
                <div className="social-media">
                  <a href="#" className="social-icon">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-twitter" />
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-google" />
                  </a>
                  <a href="#" className="social-icon">
                    <i className="fab fa-linkedin-in" />
                  </a>
                </div>
              </form>
            </div>
          </div>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here ?</h3>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
                  ex ratione. Aliquid!
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                  laboriosam ad deleniti.
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

export default Login