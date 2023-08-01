import React from 'react'
import { useState, useContext } from 'react'
import ApiContext from '../../ApiContext';
import { useLoadingUpdate } from '../../LoadingContext';
function Login({ onSuccess, onFail }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false); // New state for login success
  const [pressed, setPressed] = useState(false); // New state for login success
  const setLoading = useLoadingUpdate();
  const api = useContext(ApiContext);

  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    if (username === '') {
      setLoginError('Please enter a username');
      setPressed(true);
      return;
    }

    if (password === '') {
      setLoginError('Please enter a password');
      setPressed(true);
      return;
    }

    try {
      setLoading(true);
      api.post("/users/login", {
        username: username,
        password: password
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          console.log(response);
          const user = response.data.user;
          const cookie = response.data.accessToken;
          localStorage.setItem('access_token', cookie);
          setLoginError('');
          setLoginSuccess(true); // Set login success to true
          setTimeout(() => {
            if (onSuccess) onSuccess(user);
          }, 300);
            
        } else {
          setLoginError('Mismatched password');
          if (onFail) onFail();
          setLoginSuccess(false); // Set login success to false
        }
      }).catch((error) => {
        console.log(error)
        setLoginError('Error logging in');
        setLoginSuccess(false); // Set login success to false
      }).finally(() => {
        setPressed(true);
        setLoading(false);
      });
      
    } catch (error) {
      console.log(error);
      setLoginError('Error logging in');
      if (onFail) onFail();
      setLoginSuccess(false); // Set login success to false
    }
    // Set pressed to true
  };

  return (
    <form action="#" className="sign-in-form">
      <h2 className="title">Sign in</h2>
      <div className="input-field">
        <i className="fas fa-user" />
        <input
          type="text"
          id="username"
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="input-field">
        <i className="fas fa-lock" />
        <input
          type="password"
          id="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
      <button className="btn solid" style={pressed ? (loginSuccess ? { backgroundColor: 'green' } : { backgroundColor: 'red' }) : {}} type="submit" onClick={handleSubmitLogin}>Sign In</button>    
      </form>
  );
}

export default Login;