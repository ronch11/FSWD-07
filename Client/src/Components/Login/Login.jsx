import React from 'react'
import { useState, useContext } from 'react'
import ApiContext from '../../ApiContext';
function Login({onSuccess, onFail}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const api = useContext(ApiContext);
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
        api.post("/users/login", {
            username: username,
            password: password
          }).then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            console.log(response)
            const user = response.data.user;
            // get cookie from response
            const cookie = response.data.accessToken;
            // set cookie
            localStorage.setItem('access_token', cookie);
            if (onSuccess) onSuccess(user);
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

    // TODO: add error message
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
                    
                    <button className="btn solid" type="submit" onClick={handleSubmitLogin} >Sing In</button>
                </form>
    )
}

export default Login
