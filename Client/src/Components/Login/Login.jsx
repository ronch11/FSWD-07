import React from 'react'
import { useState, useContext } from 'react'
import ApiContext from '../../ApiContext';
import { useLoadingUpdate } from '../../LoadingContext';
function Login({ onSuccess, onFail }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false); // New state for login success
  const setLoading = useLoadingUpdate();
  const api = useContext(ApiContext);

  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    if (username === '') {
      setLoginError('Please enter a username');
      return;
    }

    if (password === '') {
      setLoginError('Please enter a password');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/users/login", {
        username: username,
        password: password
      });
      setLoading(false);
      if (response.status === 200) {
        console.log(response.data);
        console.log(response);
        const user = response.data.user;
        const cookie = response.data.accessToken;
        localStorage.setItem('access_token', cookie);
        if (onSuccess) onSuccess(user);
        setLoginSuccess(true); // Set login success to true
      } else {
        setLoginError('Mismatched password');
        if (onFail) onFail();
        setLoginSuccess(false); // Set login success to false
      }
    } catch (error) {
      console.log(error);
      setLoginError('Error logging in');
      if (onFail) onFail();
      setLoginSuccess(false); // Set login success to false
    }
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
      <button className={`btn solid ${loginSuccess ? 'green' : ''}`} type="submit" onClick={handleSubmitLogin}>Sign In</button>
    </form>
  );
}

export default Login;