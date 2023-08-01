import React from 'react'
import { useState, useContext } from 'react'
import ApiContext from '../../ApiContext';
import { useLoadingUpdate } from '../../LoadingContext';
function Register({onSuccess, onFail}) {
    const api = useContext(ApiContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pressed, setPressed] = useState(false); // New state for login success
    const [registerSuccess, setRegisterSuccess] = useState(false); // New state for login success
    const setLoading = useLoadingUpdate();
    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        setLoading(true);
        api.post("/users/CreateUser", {
            username,
            password,
            email,
            firstName,
            lastName,
            phone
        })
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    console.log(response.data);
                    const user = response.data;
                    user.password = password;
                    // login with registered user
                    api.post("/users/login", {
                        username: username,
                        password: password
                      }).then((response) => {
                      if (response.status === 200) {
                        const user = response.data.user;
                        // get cookie from response
                        const cookie = response.data.accessToken;
                        // set cookie
                        localStorage.setItem('access_token', cookie);
                        setRegisterSuccess(true);
                        setTimeout(() =>{
                            if (onSuccess) onSuccess(user);
                        }, 600)
                      }
                      else {
                        console.log('Login Failed');
                        setLoginError('Mismatched password');
                      }
                    }).catch((error) => {
                      console.log(error)
                      setLoginError('Error logging in');
                    }).finally(() => {
                        setLoading(false);
                        setPressed(true)
                    });
                    
                    // TODO: move to onSuccess
                    // onRegister(user);
                    // navigate("/");
                }
                else {
                    alert("Registration is incorrect");
                    if (onFail) onFail();
                }

            }).catch((error) => {
                console.log(error);
                alert("Registration is incorrect");
                if (onFail) onFail();
            });
    };
  return (
      <form action="#" className="sign-up-form">
                <h2 className="title">Sign up</h2>
                <div className="input-field">
                    <i className="fas fa-user" />
                    <input
                        type="text"
                        id="username"
                        placeholder='Username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="input-field">
                 <i className="fas fa-envelope" />
                 <input
                   type="password"
                   id="password"
                   value={password}
                   placeholder='Password'
                onChange={(event) => setPassword(event.target.value)}
                />
                </div>
                <div className="input-field">
                    <i className="fas fa-lock" />
                    <input
                        type="text"
                        id="email"
                        value={email}
                        placeholder='Email'
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="input-field">
                    <i className="fas fa-lock" />
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        placeholder='First Name'
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                </div>
                <div className="input-field">
                    <i className="fas fa-lock" />
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                            placeholder='Last Name'
                        onChange={(event) => setLastName(event.target.value)}
                    />
                </div>
                <div className="input-field">
                   <i className="fas fa-lock" />
                   <input
                        type="text"
                        id="phone"
                        value={phone}
                        placeholder='Phone'
                        onChange={(event) => setPhone(event.target.value)}
                    />
                </div>

                <button type="submit" style={pressed ? (registerSuccess ? { backgroundColor: 'green' } : { backgroundColor: 'red' }) : {}} onClick={handleSubmitRegister} className="btn" >Sign Up</button>
              </form>
  )
}

export default Register
